import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { title } from "process";
import { prisma } from "@/lib/prisma";

describe('Validate Check-in  (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Explosão',
        latitude: -20.3309138,
        longitude: -40.405206,
      }
    })

    const user = await prisma.user.findFirstOrThrow()

    let checkIns = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      }
    })


    const response = await request(app.server)
      .patch(`/check-ins/${checkIns.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()


    expect(response.statusCode).toEqual(204)

    checkIns = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIns.id
      }
    })

    expect(checkIns.validated_at).toEqual(expect.any(Date))

  })
})