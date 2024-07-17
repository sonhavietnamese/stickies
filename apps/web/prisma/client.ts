import { type Prisma, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export type Story = Prisma.Args<typeof prisma.stories, 'create'>['data']
export type User = Prisma.Args<typeof prisma.users, 'create'>['data']
export type Sticker = Prisma.Args<typeof prisma.stickers, 'create'>['data']
