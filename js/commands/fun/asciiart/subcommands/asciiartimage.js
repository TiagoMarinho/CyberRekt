const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');

const average = (...values) => values.reduce((accumulator, v) => accumulator + v) / values.length

function scale (number, inMin, inMax, outMin, outMax) {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const asciiArtImage = async (interaction) => {

	await interaction.deferReply()
	const attachment = interaction.options.getAttachment(`image`)
	const resolution = parseInt(interaction.options.getString(`resolution`)) || 64

	const width = resolution
	const height = Math.floor(resolution * 0.4)
	const myCanvas = createCanvas(width, height)
	const ctx = myCanvas.getContext(`2d`)

	console.log(attachment)

	loadImage(attachment.url).then(image => {
		ctx.drawImage(image, 0, 0, width, height)

		const pixelData = ctx.getImageData(0, 0, width, height)
		const imageData = pixelData.data

		let result = ``
		//const charIntensities = ` ░▒▓█`
		const charIntensities = ` ˑ.'-",:;~+*iloöõB#%&`
		const steps = charIntensities.length
		for (let i = 0; i < imageData.length; i += 4) {
			const value = imageData[i]

			const step = Math.round(scale(value, 0, 255, 0, charIntensities.length - 1))
			const char = charIntensities.charAt(step)

			imageData[i    ] = step * (255 / steps)
			imageData[i + 1] = step * (255 / steps)
			imageData[i + 2] = step * (255 / steps)
			imageData[i + 3] = 255

			result += `${char}${(i / 4 + 1) % width === 0 ? `\n` : ``}`
		} 
		console.log(result)
		
		ctx.putImageData(pixelData, 0, 0)
		const buffer = myCanvas.toBuffer(`image/png`)
		const canvasResult = new MessageAttachment(buffer, `output.png`)

		const aboutImageString = `Downsampled image:`

		return interaction.editReply({content: `\`\`\`${result}\n\`\`\`${aboutImageString}`, files: [canvasResult]});
	})
}
module.exports = asciiArtImage