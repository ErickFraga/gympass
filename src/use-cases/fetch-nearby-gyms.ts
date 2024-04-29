import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from '@prisma/client';

interface FetchNearbyGymsUseCaseRequest {
  userLongitude: number
  userLatitude: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {

  constructor(public gymsRepository: GymsRepository) { }

  async execute({
    userLongitude,
    userLatitude
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude
    })
    return { gyms }
  }
}