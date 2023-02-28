import { Request, Response, NextFunction } from 'express'
import { Competence, CompetenceProfile, UserCompetence } from '../../../src/util/Types'

jest.mock('../../../src/integrations/DAO/DAO', () => ({
  doTransaction: async (cb: () => Promise<unknown>) => await cb(),
}))

jest.mock('../../../src/integrations/DAO/availabilityDAO', () => ({
  selectAvailabilitiesByPersonId: jest.fn(async (personId: number) => {
    return [] as Competence[]
  }),
  selectAvailabilities: jest.fn(async () => {
    return [] as unknown as CompetenceProfile[]
  }),
  insertAvailability: jest.fn((personId: number, fromDate: Date, toDate: Date) => {
    return 1
  }),
  dropAvailability: jest.fn(async (availabilityId: number) => {
    return null
  }),

  updateAvailability: jest.fn(
    async (availabilityId: number, fromDate: Date, toDate: Date) => {
      return null
    },
  ),
}))
