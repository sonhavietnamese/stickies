'use client'

import { DUMMY_IMAGE } from '@/constants'
import { createMask, loadImage } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'

export default function Page() {
	const [mask, setMask] = useState<string | null>(null)
	const [image, setImage] = useState<HTMLImageElement | null>(null)

	useEffect(() => {
		const handle = async () => {
			const image = await loadImage(`data:image/jpeg;base64,${DUMMY_IMAGE}`)
			setImage(image)

			const mask = createMask(image, 20).toDataURL()
			setMask(mask)
		}

		handle()
	}, [])

	return (
		<main className={'relative h-screen w-screen overflow-hidden'}>
			{mask && image && (
				<Draggable
					defaultPosition={{
						x: 10,
						y: 0,
					}}
				>
					<div
						style={{
							width: `${(image.width + 19 * 2) * 0.25}px`,
							height: `${(image.height + 19 * 2) * 0.25}px`,
							userSelect: 'none',
						}}
					>
						<div
							className={'relative h-full w-full '}
							style={{
								maskSize: 'cover',
								maskImage: `url(${mask})`,
								maskMode: 'alpha',
							}}
						>
							<div className={'gradient relative h-full w-full'} style={{}} />
							<figure
								className={'absolute inset-0 z-10 h-full w-full'}
								style={{
									padding: 19 * 0.25,
								}}
							>
								<img
									draggable={false}
									src={image.src}
									className={'w-full select-none'}
									style={{
										top: 0,
										left: 0,
									}}
									alt={''}
								/>
							</figure>
						</div>
					</div>
				</Draggable>
			)}
		</main>
	)
}
