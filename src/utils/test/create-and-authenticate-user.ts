import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin: boolean = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 8),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'jhondoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
