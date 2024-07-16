import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'My',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return children
}
