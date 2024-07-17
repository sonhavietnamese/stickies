// import Stories from '@/components/stories'
// import { auth } from '@clerk/nextjs/server'
//
// export default async function Page() {
// 	const { userId } = auth()
//
// 	// let user
// 	// let currentStory: Story
// 	//
// 	// if (userId) {
// 	// 	user = await prisma.users.findFirst({
// 	// 		where: {
// 	// 			id: userId,
// 	// 		},
// 	// 		include: {
// 	// 			stickers: true, // Include stickers related to the user
// 	// 			stories: true, // Include stories related to the user
// 	// 		},
// 	// 	})
// 	// }
// 	//
// 	// if (!user) {
// 	// 	return (
// 	// 		<main className={'min-h-screen'}>
// 	// 			<p>Sign in to view this page</p>
// 	// 		</main>
// 	// 	)
// 	// }
//
// 	const user = {
// 		stories: [],
// 	}
//
// 	return (
// 		<main className={'relative h-screen w-screen overflow-hidden'}>
// 			<Stories stories={user.stories} />
// 			{/*{mask && image && (*/}
// 			{/*	<Sticker position={{ x: 20, y: 20 }} mask={mask} image={image} onChange={() => {}} outline={'hey'} />*/}
// 			{/*)}*/}
// 			{/*{mask && image && (*/}
// 			{/*	<Sticker mask={mask} position={{ x: 40, y: 40 }} image={image} onChange={() => {}} outline={'hey'} />*/}
// 			{/*)}*/}
// 		</main>
// 	)
// }
'use client'
import Sticker from '@/components/stickers'
import { DUMMY_IMAGE } from '@/constants'
import { createMask, loadImage } from '@/lib/utils'
import { useEffect, useState } from 'react'

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
		<main className={'min-h-screen bg-black'}>
			{mask && image && (
				<Sticker mask={mask} position={{ x: 40, y: 40 }} image={image} onChange={() => {}} outline={'hey'} />
			)}
		</main>
	)
}
