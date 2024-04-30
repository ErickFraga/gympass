import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date()
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find(item => item.id === id)

    if (!gym) return null

    return gym
  }

  async searchMany(query: string, page: number = 1) {
    const PAGE_SIZE = 20
    const PAGE_START = (page - 1) * PAGE_SIZE
    const PAGE_END = page * PAGE_SIZE

    return this.items.filter(item => item.title.includes(query)).slice(PAGE_START, PAGE_END)
  }

  async findManyNearby(params: FindManyNearbyParams) {

    const NEAR_DISTANCE_IN_KILOMETERS = 10

    const nearbyGyms = this.items.filter(item => {

      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude
        },
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude)
        }
      )
      return distance <= NEAR_DISTANCE_IN_KILOMETERS
    })

    return nearbyGyms

  }
}