import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { title } from "process";

describe('Search Gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Explosão',
        description: 'academia explosão',
        phone: '+55027999999999',
        latitude: -20.3309138,
        longitude: -40.405206,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Formula',
        description: 'academia Formula',
        phone: '+55027999999989',
        latitude: -20.3309138,
        longitude: -40.405206,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'explosão'
      })
      .set('Authorization', `Bearer ${token}`)
      .send()



    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Explosão'
      })
    ]))
  })
})