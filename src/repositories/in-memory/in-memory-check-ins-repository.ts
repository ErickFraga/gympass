import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID().toString(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {

    const checkInIndex = this.items.findIndex(item => item.id !== checkIn.id)


    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {

    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find(item => {

      const checkInDate = dayjs(item.created_at)

      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return item.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null



    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number = 1) {

    const PAGE_SIZE = 20

    const PAGE_START = PAGE_SIZE * (page - 1)
    const PAGE_END = PAGE_START + PAGE_SIZE - 1

    return this.items.filter(item => item.user_id === userId).slice(PAGE_START, PAGE_END)

  }

  async countByUserId(userId: string) {
    return this.items.filter(item => item.user_id === userId).length
  }

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) return null

    return checkIn
  }

}