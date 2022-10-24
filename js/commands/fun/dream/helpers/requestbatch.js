const { getRandomInt } = require('../../../../helpers/math.js');
const requestImage = require('./requestimage.js');

const requestBatch = async (
	batchCount = 1, 
	prompt = "",
	negativePrompt = "", 
	seed = -1, 
	initImage = null, 
	denoising = 0.75, 
	subseed = -1, 
	subseedStrength = 0.0, 
	steps = 35, 
	cfg = 11,
	width = 512,
	height = 512,
	sampler = `Euler`
) => {

	const randomizedSeed = getRandomInt(1000000000, 9999999999)

	const requests = []
	for (let i = 0; i < batchCount; ++i) {
		const finalSeed = (seed === -1 ? randomizedSeed : seed) + (subseedStrength > 0 ? 0 : i)
		const request = requestImage(
			prompt,
			negativePrompt,
			finalSeed,
			initImage,
			denoising,
			subseed,
			subseedStrength,
			steps,
			cfg,
			width,
			height,
			sampler
		)
		requests.push(request)
		console.log(`finished sending request ${i}!`)
	}
	return requests
}

module.exports = requestBatch