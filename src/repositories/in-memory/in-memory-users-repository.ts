import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create({ email, name, password_hash }: Prisma.UserCreateInput) {
    const user = {
      id: String(this.items.length + 1),
      name,
      email,
      password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
