import { Request, Response, NextFunction } from 'express'
import { Application, ApplicationPreview } from '../../../src/util/Types'

jest.mock('../../../src/integrations/DAO/DAO', () => ({
  doTransaction: async (cb: () => Promise<unknown>) => await cb(),
}))

jest.mock('../../../src/integrations/DAO/applicationDAO', () => ({
  selectApplication: jest.fn(async () => {
    return { status: { statusId: 1 } } as Application
  }),
  selectApplicationByPersonAndOpportunity: jest.fn(async (personId: number) => {
    if (personId === -1) throw new Error()
    return {} as Application
  }),
  selectApplicationsByPersonId: jest.fn(async (personId: number) => {
    return [] as Application[]
  }),
  insertApplication: jest.fn(async (personId: number, opportunityId: number) => {
    if (personId === -1) throw new Error()
    return null
  }),
  selectApplicationStatusId: jest.fn(async (statusName: string) => {
    return 1 as number
  }),
  dropApplication: jest.fn(async (personId: number) => {
    if (personId === -1) throw new Error('')
    return null
  }),
  updateApplicationStatus: jest.fn(async (applicationId: number, newStatusId: number) => {
    return null
  }),
  selectApplicationPreview: jest.fn(async (opportunityId: number) => {
    return [] as ApplicationPreview[]
  }),
}))
