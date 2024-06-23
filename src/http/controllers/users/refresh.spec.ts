import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from 'supertest'
import { app } from "@/app";

describe('Refresh (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Fulano',
        email: 'fulano@gmail.com',
        password: '123456'
      })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'fulano@gmail.com',
        password: '123456'
      })

    const cookies = authResponse.headers['set-cookie']

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      token: expect.any(String)
    }))

    expect(response.get('set-cookie')).toEqual(expect.arrayContaining([
      expect.stringContaining('refreshToken=')
    ]))
  })
})