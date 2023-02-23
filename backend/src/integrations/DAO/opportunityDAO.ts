import { z } from 'zod'
import { Opportunity } from '../../util/Types'
import { OpportunitySchema } from '../../util/schemas'
import { queryDatabase } from './DAO'

/**
 * Util function for parsing db output to match scheme of {@link Opportunity}
 * @param x Database output
 * @returns Opportunity as {@link Opportunity}
 */
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
 * Calls database and retrieves all opportunities
 * @returns Opportunities as {@link Opportunity}[]
 */
export async function selectOpportunities() {
  const response = await queryDatabase(`SELECT * FROM opportunity`, [])
  const opportunitySchema = z.array(OpportunitySchema)
  return opportunitySchema.parse(response.rows.map(toOpportunity))
}

/**
 * Calls database and retrieves all opportunity
 * @returns Opportunities as {@link Opportunity}[]
 */
export async function selectApplicableOpportunities() {
  const response = await queryDatabase(
    `
        SELECT * FROM public.opportunity
        WHERE NOW() BETWEEN application_period_start AND application_period_end
    `,
    [],
  )
  return z.array(OpportunitySchema).parse(response.rows.map(toOpportunity))
}

/**
 * Calls database and retrieves as specific opportunity
 * @param opportunityId Id of the opportunity to retrieve as `number`
 * @returns Opportunity as {@link Opportunity}
 */
export async function selectOpportunity(opportunityId: number) {
  const response = await queryDatabase(
    `SELECT * FROM opportunity WHERE opportunity_id = $1`,
    [opportunityId],
  )
  if (response.rowCount === 0) return null
  return OpportunitySchema.parse(toOpportunity(response.rows[0]))
}

/**
 * Calls database and retrieves a specific applicable opportunity
 * @param opportunityId Id of the applicable opportunity to retrieve as `number`
 * @returns Applicable opportunity as {@link Opportunity}
 */
export async function selectApplicableOpportunity(opportunityId: number) {
  const response = await queryDatabase(
    `
        SELECT * FROM opportunity 
        WHERE opportunity_id = $1 AND NOW() BETWEEN application_period_start AND application_period_end
    `,
    [opportunityId],
  )
  if (response.rowCount === 0) return null
  return OpportunitySchema.parse(toOpportunity(response.rows[0]))
}

/**
 * Calls database and inserts an opportunity
 * @param periodStart date of the start of the opportunity as `Date`
 * @param periodEnd date of the end of the opportunity as `Date`
 * @param name Identifies the opportunity as `string`
 * @param description Detailed information about the opportunity as `string`
 * @returns `void`
 */
export async function insertOpportunity(
  periodStart: Date,
  periodEnd: Date,
  name: string,
  description: string,
) {
  await queryDatabase(
    `INSERT INTO opportunity(application_period_start, application_period_end, name, description) VALUES($1, $2, $3, $4, $5)`,
    [periodStart, periodEnd, name, description],
  )
}

/**
 * Calls database and updaes a specified opportunity
 * @param opportunityId Id of a specific opportunity as `number`
 * @param periodStart date of the start of the opportunity as `Date`
 * @param periodEnd date of the end of the opportunity as `Date`
 * @param name Identifies the opportunity as `string`
 * @param description Detailed information about the opportunity as `string`
 * @returns `void`
 */
export async function updateOpportunity(
  opportunityId: number,
  periodStart: Date,
  periodEnd: Date,
  name: string,
  description: string,
) {
  await queryDatabase(
    `UPDATE opportunity SET application_period_start = $1, application_period_end = $2, name = $3, description = $4 WHERE opportunity_id = $5`,
    [periodStart, periodEnd, name, description, opportunityId],
  )
}

/**
 * Calls database and drops a specific opportunity row
 * @param opportunityId Id of the specific opportunity to drop`
 * @returns `void`
 */
export async function dropOpportunity(opportunityId: number) {
  await queryDatabase(
    `DELETE FROM opportunity WHERE opportunity_id = $1`,
    [opportunityId],
  )
}
