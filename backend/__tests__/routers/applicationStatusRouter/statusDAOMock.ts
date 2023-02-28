import { Request, Response, NextFunction } from 'express'
import { ApplicationStatus } from '../../../src/util/Types'

jest.mock('../../../src/integrations/DAO/DAO', () => ({
  doTransaction: async (cb: () => Promise<unknown>) => await cb(),
}))

jest.mock('../../../src/integrations/DAO/statusDAO', () => ({
    selectApplicationStatus: jest.fn(async () => {
    return [] as ApplicationStatus[]
  })
}))
