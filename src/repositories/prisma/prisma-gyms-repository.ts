import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = prisma.gym.create({
      data
    })

    return gym
  }
  async findById(id: string) {
    const gym = prisma.gym.findUnique({
      where: {
        id
      }
    })
    return gym
  }
  async searchMany(query: string, page: number = 1) {
    const PAGE_SIZE = 20
    const SKIP = (page - 1) * PAGE_SIZE
    const gyms = prisma.gym.findMany({
      where: {
        title: {
          contains: query
        }
      },
      take: PAGE_SIZE,
      skip: SKIP
    })
    return gyms
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = prisma.$queryRaw<Gym[]>`
    SELECT * FROM gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }

}