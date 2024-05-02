import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function search(request: FastifyRequest, reply: FastifyReply) {

  const searchGymsParamsSchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1)
  })

  const { q, page } = searchGymsParamsSchema.parse(request.query)

  const searchGymUseCase = makeSearchGymUseCase()

  const { gyms } = await searchGymUseCase.execute({
    query: q,
    page
  })


  return reply.status(200).send({ gyms })
}
