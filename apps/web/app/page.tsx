import { prisma } from '@/prisma/client'
import { SignInButton, SignOutButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Home() {
	const { userId } = auth()
	const user = await currentUser()

	if (userId && user) {
		const existUser = await prisma.users.findFirst({
			where: {
				id: userId,
			},
		})

		if (!existUser) {
			const newUser = await prisma.users.create({
				data: {
					id: userId,
					name: user.lastName,
				},
			})
		}
	}

	return (
		<main className={'min-h-screen'}>
			<SignInButton mode={'modal'}>
				<button type={'submit'}>Sign in with Clerk</button>
			</SignInButton>

			{user && (
				<div>
					<p>{user.fullName}</p>
					<p>{user.imageUrl}</p>

					<SignOutButton>
						<button type={'submit'}>Sign out</button>
					</SignOutButton>
				</div>
			)}
		</main>
	)
}
