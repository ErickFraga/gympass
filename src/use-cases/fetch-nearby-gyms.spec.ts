import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

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
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {

    await gymsRepository.create({
      title: 'Academia Proxima',
      description: 'academia explosão',
      phone: '+55027999999999',
      latitude: -20.330913840835954,
      longitude: -40.405206449833955,
    })

    await gymsRepository.create({
      title: 'Academia Distante',
      description: 'academia explosão',
      phone: '+55027999999999',
      latitude: -20.250596942926443,
      longitude: -40.272230704720194,
    })


    const { gyms } = await sut.execute({
      userLatitude: -20.330913840835954,
      userLongitude: -40.405206449833955
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Academia Proxima' })])

  })
})