import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository copy'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {

    const { user } = await sut.execute({
      name: 'fulano',
      email: 'fulano@gmail.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash use password upon registration', async () => {

    const { user } = await sut.execute({
      name: 'fulano',
      email: 'fulano@gmail.com',
      password: '123456'
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)

  })

  it('should not be able to register with same email twice', async () => {

    const email = 'fulano@gmail.com'

    await sut.execute({
      email,
      name: 'Fulano',
      password: '123456'
    })

    await expect(() => sut.execute({
      email,
      name: 'Fulano',
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)

  })
})