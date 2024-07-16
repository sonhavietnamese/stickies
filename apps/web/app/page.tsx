import { SignInButton } from '@clerk/nextjs'

export default async function Home() {
	return (
		<main className={'min-h-screen'}>
			<SignInButton mode={'modal'}>
				<button type={'submit'}>Sign in with Clerk</button>
			</SignInButton>
			{/*<h1>Home</h1>*/}
		</main>
	)
}
