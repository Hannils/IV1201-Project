import { Competence, CompetenceSchema, OpportunitySchema
} from '../../util/Types'
import { queryDatabase } from './DAO'
import { z } from "zod"

function toOpportunity(x: any) {
  if (!x) return null
  return {
    opportunityId: x.opportunity_id,
    applicationPeriodStart: x.application_period_start,
    applicationPeriodEnd: x.application_period_end,
    name: x.name,
    description: x.description,
  }
}

/**
 * Calls database and retrieves all opportunity
 * @returns Opportunities as {@link Opportunity}[]
 */
export async function selectOpportunities() {
  const response = await queryDatabase(`SELECT * FROM opportunity`, [])
  response.rows.map(res => console.log(res))
  const opportunitySchema = z.array(OpportunitySchema)
  return opportunitySchema.parse(response.rows.map(toOpportunity))
}


export async function selectOpportunity(opportunityId: number) {
    const response = await queryDatabase(`SELECT * FROM opportunity WHERE opportunity_id = $1`, [opportunityId])
    return response.rows[0]
}

/**
 * Calls database and inserts an opportunity
 * @param periodStart date of the start of the opportunity as `Date`
 * @param periodEnd date of the end of the opportunity as `Date`
 * @param name Identifies the opportunity as `string`
 * @param description Detailed information about the opportunity as `string`
 */
export async function insertOpportunity(
  periodStart: Date,
  periodEnd: Date,
  name: string,
  description: string,
) {
  const response = await queryDatabase(
    `INSERT INTO opportunity(application_period_start, application_period_end, name, description) VALUES($1, $2, $3, $4, $5)`,
    [periodStart, periodEnd, name, description],
  )
}

/**
 * Calls database and updaes a specified opportunity
 * @param opportunityId Id of a specific oppurtunity as `number`
 * @param periodStart date of the start of the opportunity as `Date`
 * @param periodEnd date of the end of the opportunity as `Date`
 * @param name Identifies the opportunity as `string`
 * @param description Detailed information about the opportunity as `string`
 */
export async function updateOpportunity(
  opportunityId: number,
  periodStart: Date,
  periodEnd: Date,
  name: string,
  description: string,
) {
  const reponse = await queryDatabase(
    `UPDATE opportunity SET application_period_start = $1, application_period_end = $2, name = $3, description = $4 WHERE opportunity_id = $5`,
    [periodStart, periodEnd, name, description, opportunityId],
  )
}


export async function dropOpportunity(opportunityId: number) {
    const response = await queryDatabase(`DELETE FROM opportunity WHERE opportunity_id = $1`, [opportunityId])
}


