import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface CreateAndAuthenticateUserResponse {
  token: string
}

export async function createAndAuthenticateUser(app: FastifyInstance, role?: 'ADMIN' | 'MEMBER'): Promise<CreateAndAuthenticateUserResponse> {
  const response = await prisma.user.create({
    data: {
      name: 'Fulano',
      email: 'fulano@gmail.com',
      role,
      password_hash: await hash('123456', 6),
    }
  })

  const { body } = await request(app.server)
    .post('/sessions')
    .send({
      email: 'fulano@gmail.com',
      password: '123456'
    })


  return { token: body.token }
}