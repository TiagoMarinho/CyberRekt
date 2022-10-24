const fetch = require('node-fetch');

const { roundToClosestMultipleOf } = require('../../../../helpers/math.js');

const requestImage = async (
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
	const isImageToImage = initImage !== null

	// width and height must be multiples of 64
	const sanitizedWidth = roundToClosestMultipleOf(width, 64)
	const sanitizedHeight = roundToClosestMultipleOf(height, 64)

	const payload = {
		"init_images": [
			initImage
		],
		"enable_hr": false,
		"denoising_strength": denoising,
		"firstphase_width": 0,
		"firstphase_height": 0,
		"prompt": prompt,
		"seed": seed,
		"subseed": subseed,
		"subseed_strength": subseedStrength,
		"seed_resize_from_h": -1,
		"seed_resize_from_w": -1,
		"batch_size": 1,
		"n_iter": 1,
		"steps": steps,
		"cfg_scale": cfg,
		"width": sanitizedWidth,
		"height": sanitizedHeight,
		"restore_faces": false,
		"tiling": false,
		"negative_prompt": negativePrompt,
		"eta": 0,
		"s_churn": 0,
		"s_tmax": 0,
		"s_tmin": 0,
		"s_noise": 1,
		"sampler_index": sampler
	}
	const mode = `${isImageToImage ? `img` : `txt`}2img`
	console.log(`is img2img: ${isImageToImage}\nmode: ${mode}`)
	const apiEndpoint = `http://127.0.0.1:7860/sdapi/v1/${mode}`
	const request = fetch(apiEndpoint, {
		method: 'post',
		body: JSON.stringify(payload),
		headers: {'Content-Type': 'application/json'}
	})
	return request
}


module.exports = requestImage