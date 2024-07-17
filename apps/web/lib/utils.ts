import { type Canvas, type Image, createCanvas } from 'canvas'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

interface Bound {
	top: number | null
	left: number | null
	right: number | null
	bottom: number | null
}

export const outline = (
	img: Image | HTMLImageElement,
	thickness = 1,
	fillStyle: string | CanvasGradient | CanvasPattern = 'white',
	samples = 36,
): Canvas | HTMLCanvasElement => {
	const padding = 40
	const x = padding - (thickness + 1)
	const y = padding - (thickness + 1)

	const canvas = createCanvas(img.width + x * 2, img.height + y * 2)
	const ctx = canvas.getContext('2d')

	for (let angle = 0; angle < 360; angle += 360 / samples) {
		ctx.drawImage(
			img as Image,
			thickness * Math.sin((Math.PI * 2 * angle) / 360) + x,
			thickness * Math.cos((Math.PI * 2 * angle) / 360) + y,
		)
	}

	const grad = ctx.createLinearGradient(0, 0, 280, 0)
	grad.addColorStop(0, 'lightblue')
	grad.addColorStop(1, 'darkblue')

	ctx.globalCompositeOperation = 'source-in'
	ctx.fillStyle = grad
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.globalCompositeOperation = 'source-over'
	ctx.drawImage(img as Image, x, y)

	return canvas

	// return trim(canvas)
}

export function createMask(img: Image | HTMLImageElement, thickness = 1, samples = 40): Canvas | HTMLCanvasElement {
	const x = thickness + 1
	const y = thickness + 1

	const canvas = createCanvas(img.width + x * 2, img.height + y * 2)
	const ctx = canvas.getContext('2d')

	for (let angle = 0; angle < 360; angle += 360 / samples) {
		ctx.drawImage(
			img as Image,
			thickness * Math.sin((Math.PI * 2 * angle) / 360) + x,
			thickness * Math.cos((Math.PI * 2 * angle) / 360) + y,
		)
	}

	ctx.globalCompositeOperation = 'source-in'
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.globalCompositeOperation = 'source-over'
	ctx.drawImage(img as Image, x, y)

	return canvas
}

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			resolve(reader.result as string)
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

export async function loadImage(base64Image: string): Promise<HTMLImageElement> {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => {
			try {
				resolve(img)
			} catch (error) {
				reject(error)
			}
		}
		img.onerror = reject
		img.src = base64Image
	})
}

type RemoveBackgroundOutputParams = {
	id: string
}
export async function getRemoveBackgroundOutput(params: RemoveBackgroundOutputParams) {
	const { id } = params

	if (!id) {
		return
	}

	const maxRetries = 5
	let retries = 0

	while (retries < maxRetries) {
		const outputResponse = await fetch('http://45.76.54.67:8288/v0/gql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				operationName: 'GetEvent',
				variables: { id },
				query: `
                    query GetEvent($id: ID!) {
                        event(query: {eventId: $id}) {
                            id
                            name
                            createdAt
                            status
                            pendingRuns
                            raw
                            functionRuns {
                                function {
                                    name
                                }
                                id
                                status
                                startedAt
                                pendingSteps
                                output
                                waitingFor {
                                    expiryTime
                                    eventName
                                    expression
                                }
                            }
                        }
                    }
                `,
			}),
		})

		const outputData = await outputResponse.json()

		if (outputData.data?.event && outputData.data.event.functionRuns[0].status === 'COMPLETED') {
			const parse = JSON.parse(outputData.data.event.functionRuns[0].output)
			const base64 = parse.base64_image
			return { imageBase64: base64 }
		}
		retries++
		await new Promise((resolve) => setTimeout(resolve, 1000))
	}

	throw new Error('Maximum retries reached, processing not completed.')
}
