import { Gym, Prisma } from "@prisma/client";

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(userId: string): Promise<Gym | null>
  searchMany(title: string, page?: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}

