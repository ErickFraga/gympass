import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {

  const createCheckInParamsSchema = z.object({
    checkInId: z.string()
  })


  const { checkInId } = createCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  const { checkIn } = await validateCheckInUseCase.execute({
    checkInId,

  })


  return reply.status(204).send({ checkIn })
}
