import { Request, Response, NextFunction } from 'express'
import { Opportunity } from '../../../src/util/Types'
jest.mock('../../../src/integrations/DAO/DAO', () => ({
  doTransaction: async (cb: () => Promise<unknown>) => await cb(),
}))

jest.mock('../../../src/integrations/DAO/opportunityDAO', () => ({
  insertOpportunity: jest.fn(async (fromDate: Date, toDate: Date, name: string, description: string) => {
      if (name === 'NON_FUNCTIONAL_NAME') throw new Error('Error creating opportunity')
      return null
    }),
    dropOpportunity: jest.fn(async (opportunityId: number) => {
        if (opportunityId === 2) throw new Error('Could not drop opportunity')
        return null
      }),
    selectApplicableOpportunities: jest.fn(async () => {
        return [] as Opportunity[]
    }),
    selectApplicableOpportunity: jest.fn(async (opportunityId: number) => {
      if (opportunityId === 2) throw new Error('Could not get opportunity')
      return {} as Opportunity
    }),
    updateOpportunity: jest.fn(async (opportunityId: number, periodStart: Date, periodEnd: Date, name: string, description: string) => {
      if (opportunityId === 2) throw new Error('Could not patch opportunity')
      return null
    })
}))
