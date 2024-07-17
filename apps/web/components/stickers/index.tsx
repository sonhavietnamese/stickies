import OutlineStrokeAnimated from '@/components/stickers/outline-stroke-animated'
import type { StickerOutline } from '@/types/sticker'
import Draggable from 'react-draggable'

type StickerProps = {
	mask: string
	image: HTMLImageElement
	onChange: () => void
	outline: StickerOutline
	position: { x: number; y: number }
}

export default function Sticker(props: StickerProps) {
	const { mask, image, onChange, position } = props
	const handleStop = () => {}

	return (
		<Draggable defaultPosition={position} onStop={handleStop}>
			<div
				style={{
					position: 'absolute',
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
					{/*<OutlineSolid />*/}
					{/*<OutlineGradient />*/}
					<OutlineStrokeAnimated />
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
	)
}
