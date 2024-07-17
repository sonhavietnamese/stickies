'use client'

import Sticker from '@/components/stickers'
import { inngest } from '@/inngest'
import { createMask, fileToBase64, getRemoveBackgroundOutput, loadImage } from '@/lib/utils'
import { type ChangeEvent, useState } from 'react'

export default function Page() {
	const [mask, setMask] = useState<string | null>(null)
	const [image, setImage] = useState<HTMLImageElement | null>(null)

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files || files.length === 0) return

		const file = files[0]
		if (!file) return

		if (!['image/png', 'image/jpeg'].includes(file.type)) {
			alert('Only PNG and JPG files are allowed.')
			return
		}

		const rawImageBase64 = (await fileToBase64(file)).split(',')[1]
		const { ids } = await inngest.send({
			name: 'service/remove-background',
			data: {
				base64_image: rawImageBase64,
			},
		})

		const data = await getRemoveBackgroundOutput({ id: ids[0] })

		if (!data?.imageBase64) return

		const image = (await loadImage(`data:image/jpeg;base64,${data.imageBase64}`)) as HTMLImageElement
		setImage(image)

		const mask = createMask(image, 20).toDataURL()
		setMask(mask)
	}

	return (
		<main className={'min-h-screen bg-black'}>
			<input type="file" accept=".png, .jpg, .jpeg" onChange={handleImageChange} />

			{mask && image && (
				<Sticker mask={mask} position={{ x: 40, y: 40 }} image={image} onChange={() => {}} outline={'hey'} />
			)}
		</main>
	)
}
