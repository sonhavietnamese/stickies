import type { Story } from '@/prisma/client'

type StoryProps = {
	stories: Story[]
}

export default function Stories(props: StoryProps) {
	return (
		<>
			<section className={'absolute top-10 left-10 rounded border p-5'}>
				<span className={''}>Summer's Lullaby</span>
				<p>
					The sun-kissed beach, sprinkled with colorful umbrellas and laughter, lulled Sarah into a tranquil state. With
					the salty breeze in her hair and the rhythmic crash of waves, she found solace in the endless expanse of the
					ocean, its mysteries mirroring her own. As the fiery sunset painted the sky, peace washed over her, leaving
					behind the world's worries.
				</p>
			</section>
		</>
	)
}
