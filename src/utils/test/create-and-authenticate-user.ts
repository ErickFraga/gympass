import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface CreateAndAuthenticateUserResponse {
  token: string
}

export async function createAndAuthenticateUser(app: FastifyInstance): Promise<CreateAndAuthenticateUserResponse> {
  const response = await request(app.server)
    .post('/users')
    .send({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password: '123456'
    })

  const { body } = await request(app.server)
    .post('/sessions')
    .send({
      email: 'fulano@gmail.com',
      password: '123456'
    })


  return { token: body.token }
}