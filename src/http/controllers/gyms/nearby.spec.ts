import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { title } from "process";

describe('Nearby Gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Explosão',
        description: 'academia explosão',
        phone: '+55027999999999',
        latitude: -20.330913840835954,
        longitude: -40.405206449833955
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Formula',
        description: 'academia Formula',
        phone: '+55027999999989',
        latitude: -20.250596942926443,
        longitude: -40.272230704720194,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -20.330913840835954,
        longitude: -40.405206449833955
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