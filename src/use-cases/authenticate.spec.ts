import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'janedoe@example.com',
      password: '123456',
    })

    expect(user.id).toBeDefined()
  })

  it('should not be authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: await hash('123123', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
