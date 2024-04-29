import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository copy";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-errror";
import { GetUserProfileUseCase } from "./get-user-profile";

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(userRepository)
  })
  it('Should be able to get the user profile', async () => {
    const { id: newUserId } = await userRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: newUserId })

    expect(user.id).toEqual(newUserId)
  })
  it('Should not be able to get the user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: '74139ac1-d1dc-4f7c-8a4f-20532948ebe2'
      })).rejects.toBeInstanceOf(ResourceNotFoundError)



  })
})