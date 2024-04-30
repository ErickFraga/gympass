import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = prisma.checkIn.create({
      data
    })
    return checkIn
  }

  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      data: checkIn,
      where: {
        id: checkIn.id
      }
    })

    return updatedCheckIn
  }

  async findById(id: string) {
    const checkIn = prisma.checkIn.findUnique({
      where: {
        id
      }
    })

    if (!checkIn) return null

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate()
        }
      }
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number = 1) {
    const PAGE_SIZE = 20
    const SKIP = (page - 1) * PAGE_SIZE
    const checkIns = prisma.checkIn.findMany({
      where: {
        user_id: userId
      },
      skip: SKIP,
      take: PAGE_SIZE
    })
    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })
    return count
  }


}