// 'use server'
//
// import { prisma } from '@/prisma/client'
// import { auth } from '@clerk/nextjs/server'
//
// export async function createStory() {
// 	const { userId } = auth()
//
// 	if (!userId) {
// 		return {
// 			status: 401,
// 			data: {
// 				message: 'Unauthorized',
// 			},
// 		}
// 	}
//
// 	const user = await prisma.users.findFirst({
// 		where: {
// 			id: userId,
// 		},
// 	})
//
// 	if (!user) {
// 		return {
// 			status: 404,
// 			data: {
// 				message: 'User not found',
// 			},
// 		}
// 	}
//
// 	const story = await prisma.stories.findFirst({
// 		where: {
// 			user_id: userId,
// 			is_finished: false,
// 			level: user.level,
// 		},
// 	})
//
// 	if (story) {
// 		return {
// 			status: 409,
// 			data: {
// 				message: 'Story already exists',
// 			},
// 		}
// 	}
//
// 	const newStory = await prisma.stories.create({
// 		data: {
// 			user_id: userId,
// 		},
// 	})
// }
