import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';
import { CheckInUseCase } from './check-in';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Check-in Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })
  it('should be able to get check-ins count from metrics', async () => {

    await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1"
    })

    await checkInsRepository.create({
      gym_id: "gym-2",
      user_id: "user-1"
    })

    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    })

    expect(checkInsCount).toEqual(2)

  })
})