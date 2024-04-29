import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let usersRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(usersRepository, gymsRepository)
    gymsRepository.create({
      id: "gym-id-1",
      title: "Explosão",
      description: "any description",
      phone: '+5527997803300',
      latitude: -20.330913840835954,
      longitude: -40.405206449833955
    })
    vi.useFakeTimers()
  })
  afterEach(() => {
    gymsRepository.items = []
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955
    })

    await expect(() => sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: "gym-id-2",
      title: "Formula",
      description: "any description",
      phone: '+5527997803300',
      latitude: -20.3446728,
      longitude: -40.4004895
    })
    await expect(() => sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-2",
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})