import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: `Near Gym`,
      latitude: -23.6331903,
      longitude: -46.5266878,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: `Far Gym`,
      latitude: -23.667249,
      longitude: -45.4366542,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.6331903,
      userLongitude: -46.5266878,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
