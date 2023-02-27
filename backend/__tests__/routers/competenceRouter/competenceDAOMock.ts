import { Request, Response, NextFunction } from 'express'
import { Competence, CompetenceProfile, UserCompetence } from '../../../src/util/Types'

jest.mock('../../../src/integrations/DAO/DAO', () => ({
  doTransaction: async (cb: () => Promise<unknown>) => await cb(),
}))

jest.mock('../../../src/integrations/DAO/competenceDAO', () => ({
  selectCompetence: jest.fn(async () => {
    return [] as Competence[]
  }),
  selectCompetenceProfile: jest.fn(async (personId: number) => {
    if (personId === -1) throw new Error()
    return [] as unknown as CompetenceProfile[]
  }),
  updateUserCompetence: jest.fn(
    ({
      personId,
      competenceId,
      yearsOfExperience,
    }: {
      personId: number
      competenceId: number
      yearsOfExperience: number
    }) => undefined,
  ),
  insertUserCompetence: jest.fn(
    async (userCompetence: UserCompetence, personId: number) => null,
  ),

  dropUserCompetence: jest.fn(
    async ({ personId, competenceId }: { personId: number; competenceId: number }) => {
      if (competenceId === -1) throw new Error('Bad')
    },
  ),
}))
