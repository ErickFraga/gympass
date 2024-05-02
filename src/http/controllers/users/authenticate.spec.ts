import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from 'supertest'
import { app } from "@/app";

describe('Authenticate (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Fulano',
        email: 'fulano@gmail.com',
        password: '123456'
      })

    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'fulano@gmail.com',
        password: '123456'
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      token: expect.any(String)
    }))
  })
})