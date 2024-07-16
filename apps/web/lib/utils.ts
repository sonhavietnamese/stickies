import { type Canvas, type CanvasRenderingContext2D, type Image, createCanvas } from 'canvas'
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

function trim(c: Canvas | HTMLCanvasElement): Canvas | HTMLCanvasElement {
  const ctx = c.getContext('2d') as CanvasRenderingContext2D
  const copy = createCanvas(c.width, c.height).getContext('2d')
  const pixels = ctx.getImageData(0, 0, c.width, c.height)

  let x: number
  let y: number
  const bound: Bound = {
    top: null,
    left: null,
    right: null,
    bottom: null,
  }

  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width
      y = ~~(i / 4 / c.width)

      if (bound.top === null) {
        bound.top = y
      }

      if (bound.left === null) {
        bound.left = x
      } else if (x < bound.left) {
        bound.left = x
      }

      if (bound.right === null) {
        bound.right = x
      } else if (bound.right < x) {
        bound.right = x
      }

      if (bound.bottom === null) {
        bound.bottom = y
      } else if (bound.bottom < y) {
        bound.bottom = y
      }
    }
  }

  const trimHeight = bound.bottom ?? 0 - (bound.top ?? 0) + 1
  const trimWidth = bound.right ?? 0 - (bound.left ?? 0) + 1
  const trimmed = ctx.getImageData(bound.left ?? 0, bound.top ?? 0, trimWidth, trimHeight)

  copy.canvas.width = trimWidth
  copy.canvas.height = trimHeight
  copy.putImageData(trimmed, 0, 0)

  return copy.canvas
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
    ctx.drawImage(img as Image, thickness * Math.sin((Math.PI * 2 * angle) / 360) + x, thickness * Math.cos((Math.PI * 2 * angle) / 360) + y)
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
    ctx.drawImage(img as Image, thickness * Math.sin((Math.PI * 2 * angle) / 360) + x, thickness * Math.cos((Math.PI * 2 * angle) / 360) + y)
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
