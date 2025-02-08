import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymQuerySchema.parse(request.query)

  const searchGymUseCase = makeSearchGymsUseCase()
  const { gyms } = await searchGymUseCase.execute({
    query: q,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
