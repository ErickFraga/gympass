import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { SearchGymUseCase } from './search-gyms';

const gymTitles = [
  "Força Total Fitness",
  "Pico Performance",
  "Vitalidade Viva",
  "Desafio Diário",
  "Meta Gym",
  "Elite Energia",
  "Pulso Proativo",
  "Harmonia Holística",
  "Impacto Intenso",
  "Poder Puro",
  "Sintonia Saúde",
  "Ritmo Rápido",
  "Corpo Completo",
  "Oásis do Treino",
  "Fitness Fronteira",
  "Zenith Zone",
  "Ativo Atleta",
  "Energia Elevada",
  "Vital Vibe",
  "Motiva Movimento",
  "Pulse Perfeito",
  "Fitness Futuro",
];


let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)
  })

  it('should be able to search form gyms', async () => {

    await gymsRepository.create({
      title: 'Academia Explosão',
      description: 'academia explosão',
      phone: '+55027999999999',
      latitude: -20.330913840835954,
      longitude: -40.405206449833955,
    })

    await gymsRepository.create({
      title: 'Academia Formula',
      description: 'academia explosão',
      phone: '+55027999999999',
      latitude: -20.330913840835954,
      longitude: -40.405206449833955,
    })

    await gymsRepository.create({
      title: 'Alternativa',
      description: 'academia explosão',
      phone: '+55027999999999',
      latitude: -20.330913840835954,
      longitude: -40.405206449833955,
    })


    const { gyms } = await sut.execute({
      query: 'Acad',
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: expect.stringContaining('Acad') }),
      expect.objectContaining({ title: expect.stringContaining('Acad') }),
    ])

  })
  it('should be able to fetch paginated gyms search', async () => {

    gymTitles.forEach(async (title) =>
      await gymsRepository.create({
        title: `Academia ${title}`,
        description: 'academia explosão',
        phone: '+55027999999999',
        latitude: -20.330913840835954,
        longitude: -40.405206449833955,
      })
    )


    const { gyms } = await sut.execute({
      query: 'Acad',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia Pulse Perfeito' }),
      expect.objectContaining({ title: 'Academia Fitness Futuro' }),
    ])

  })
})