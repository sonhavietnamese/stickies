import { PrismaClient } from '@prisma/client'
import { Inngest, InngestMiddleware } from 'inngest'

// make Prisma available in the Inngest functions
const prismaMiddleware = new InngestMiddleware({
	name: 'Prisma Middleware',
	init() {
		const prisma = new PrismaClient()

		return {
			onFunctionRun(ctx) {
				return {
					transformInput(ctx) {
						return {
							// Anything passed via `ctx` will be merged with the function's arguments
							ctx: {
								prisma,
							},
						}
					},
				}
			},
		}
	},
})

// Create a client to send and receive events
export const inngest = new Inngest({
	id: 'service-remove-background',
	baseUrl: 'https://stickies.marsempires.xyz/',
})
