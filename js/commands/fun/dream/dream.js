const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const requestBatch = require('./helpers/requestbatch.js');
const { performance } = require('node:perf_hooks');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dream')
		.setDescription('Generate images using Stable Diffusion')
		.addStringOption(option => 
			option.setName('prompt')
			.setDescription(`Contents of the image`)
			.setRequired(true))
		.addStringOption(option => 
			option.setName('negative')
			.setDescription(`Things not to include in the image`)
			.setRequired(false))
		.addStringOption(option => 
			option.setName('sampler')
			.setDescription(`What sampler to use when generating the image`)
			.setChoices(
				{ name: 'Euler', value: 'Euler' },
				{ name: 'Euler Ancestral', value: 'Euler a' },
				{ name: 'Heun', value: 'Heun' },
				{ name: 'DPM fast', value: 'DPM fast' },
				{ name: 'DPM adaptive', value: 'DPM adaptive' },
				{ name: 'DPM2', value: 'DPM2' },
				{ name: 'DPM2 Ancestral', value: 'DPM2 a' },
				{ name: 'DPM2 Karras', value: 'DPM2 Karras' },
				{ name: 'DPM2 Ancestral Karras', value: 'DPM2 a Karras' },
				{ name: 'LMS', value: 'LMS' },
				{ name: 'LMS Karras', value: 'LMS Karras' },
				{ name: 'PLMS', value: 'PLMS' },
				{ name: 'DDIM', value: 'DDIM' },
			)
			.setRequired(false))
		.addIntegerOption(option => 
			option.setName('steps')
			.setDescription(`How many steps to refine the image for`)
			.setRequired(false)
			.setMinValue(10)
			.setMaxValue(100))
		.addNumberOption(option => 
			option.setName('cfg')
			.setDescription(`How closely the output should follow the prompt`)
			.setRequired(false)
			.setMinValue(1)
			.setMaxValue(30))
		.addIntegerOption(option => 
			option.setName('batch')
			.setDescription(`How many images to generate`)
			.setRequired(false)
			.setMinValue(1)
			.setMaxValue(8))
		.addIntegerOption(option => 
			option.setName('width')
			.setDescription(`Width of the resulting image`)
			.setRequired(false)
			.setMinValue(64)
			.setMaxValue(2048))
		.addIntegerOption(option => 
			option.setName('height')
			.setDescription(`Height of the resulting image`)
			.setRequired(false)
			.setMinValue(64)
			.setMaxValue(2048))
		.addIntegerOption(option => 
			option.setName('seed')
			.setDescription(`Seed to use for the initial noise`)
			.setRequired(false))
		.addBooleanOption(option => 
			option.setName('prefix')
			.setDescription(`Append the base NovelAI prefixes to prompt and negative prompt`)
			.setRequired(false))
		.addNumberOption(option => 
			option.setName('varstrength')
			.setDescription(`How much noise to add over the original seed`)
			.setRequired(false)
			.setMinValue(0)
			.setMaxValue(1))
		.addIntegerOption(option => 
			option.setName('varseed')
			.setDescription(`Seed to mix into the generation`)
			.setRequired(false))
		.addAttachmentOption(option => 
			option.setName('image')
			.setDescription(`Image to use for img2img`)
			.setRequired(false))
		.addNumberOption(option => 
			option.setName('denoising')
			.setDescription(`How much noise to add over the image in img2img`)
			.setRequired(false)
			.setMinValue(0)
			.setMaxValue(1)),
	async execute(interaction) {
		
		
		console.log(interaction)
		console.log(`command execution started! full command: ${interaction}`)
		let timePassed = 0
		const logEvery500msID = setInterval(_ => {
			timePassed += 0.5
			console.log(`${timePassed} seconds have passed since command execution started!`)
		}, 500)
		await interaction.deferReply()
		clearInterval(logEvery500msID)
		console.log(`reply deferred!`)

		const prompt = interaction.options.getString(`prompt`) || undefined
		const negativePrompt = interaction.options.getString(`negative`) || undefined

		const sampler = interaction.options.getString(`sampler`) || undefined
		const steps = interaction.options.getInteger(`steps`) || undefined
		const cfg = interaction.options.getNumber(`cfg`) || undefined
		const seed = interaction.options.getInteger(`seed`) || undefined

		const batchCount = interaction.options.getInteger(`batch`) || undefined

		const width = interaction.options.getInteger(`width`) || undefined
		const height = interaction.options.getInteger(`height`) || undefined

		const prefix = interaction.options.getBoolean(`prefix`) || undefined

		const subseed = interaction.options.getInteger(`varseed`) || undefined
		const subseedStrength = interaction.options.getNumber(`varstrength`) || undefined

		const inputImage = interaction.options.getAttachment(`image`) || undefined
		const denoising = interaction.options.getNumber(`denoising`) || undefined

		console.log(`retrieved all command options!`)

		// img2img
		const isImg2Img = typeof inputImage !== `undefined`
		let base64InputImage = null
		if (isImg2Img) {
			const inputImageUrlData = await fetch(inputImage.url)
			const inputImageBuffer = await inputImageUrlData.arrayBuffer()
			base64InputImage = Buffer.from(inputImageBuffer).toString('base64')
		}

		console.log(`past img2img code!`)

		// calculate how long it will take to generate to prevent DDoS
		const maximumTime = Infinity
		const doubleCostSamplers = ['Heun', 'DPM2', 'DPM2 a', 'DPM2 Karras', 'DPM2 a Karras']
		const defaultTimeCost = 35 * 512 * 512
		const expectedTimePerDefaultImage = 2
		const isHighCostSampler = doubleCostSamplers.includes(sampler)
		const samplerCost = isHighCostSampler ? 2 : 1
		const timeCost = steps * width * height * batchCount * samplerCost / defaultTimeCost
		const timeCostThreshold = maximumTime / expectedTimePerDefaultImage

		if (timeCost > timeCostThreshold)
			return interaction.editReply(`Requested batch would take too long`)

		// calculate generation cost at given resolution to check if it will fit in memory
		const defaultResolutionCost = 512 * 512
		const resolutionCost = (width * height) / defaultResolutionCost
		const resolutionCostThreshold = 4
		
		if (resolutionCost > resolutionCostThreshold)
			return interaction.editReply(`Requested image size is too high`)

		// novelAI prefixing
		const novelaiPromptPrefix = `masterpiece, best quality${prompt ? `, ` : ``}`
		const prefixedPrompt = `${novelaiPromptPrefix}${prompt}`
		const novelaiNegativePrefix = `lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name${negativePrompt ? `, ` : ``}`
		const prefixedNegativePrompt = `${novelaiNegativePrefix}${negativePrompt}`

		const finalPrompt = prefix ? prefixedPrompt : prompt
		const finalNegativePrompt = prefix ? prefixedNegativePrompt : negativePrompt

		const results = []

		console.log(`past variable declaration chunk!`)

		const requests = 
			await requestBatch(
				batchCount,
				finalPrompt,
				finalNegativePrompt,
				seed,
				inputImage,
				denoising,
				subseed,
				subseedStrength,
				steps,
				cfg,
				width,
				height,
				sampler
			)

		console.log(`finished sending all requests!`)

		for (const [index, request] of requests.entries()) {
			const startTime = performance.now()
			const response = await request
			const timeTaken = performance.now() - startTime
			const timeTakenFormatted = Math.floor(timeTaken / 100) / 10
			const message = await interaction.fetchReply()
			const data = await response.json()
			const buffers = data.images.map(i => Buffer.from(i, "base64"))
			const filename = `${index}-${data.parameters.seed}.png`
			const attachments = buffers.map(buffer => new MessageAttachment(buffer, filename))

			results.push(...attachments)

			const isFirstImage = index === 0
			const isLastImage = index === requests.length - 1
			const color = isLastImage ? `#2E8B21` : `#A50A39`

			const embeds = []
			for (const [oldEmbedIndex, oldEmbed] of message.embeds.entries()) {
				const newEmbed = new MessageEmbed(oldEmbed)

				// resend all images at the end to avoid discord server deleting the previous ones
				if (isLastImage) {
					const attachment = results[oldEmbedIndex]
					newEmbed.setColor(`#2E8B21`)
					newEmbed.setImage(`attachment://${attachment.name}`)
				}

				embeds.push(newEmbed)
			}

			const embed = new MessageEmbed()
				.setColor(color)
				.setTitle(`${data.parameters.seed}`)
				.setImage(`attachment://${filename}`)
				.setFooter({text: `time taken: ${timeTakenFormatted}s`})
			
			embeds.push(embed)

			await interaction.editReply({embeds: embeds, files: isLastImage ? results : attachments})
			console.log(`finished dealing with result number ${index}!`)
		}
		console.log(`finished /dream command execution!`)
	},
};