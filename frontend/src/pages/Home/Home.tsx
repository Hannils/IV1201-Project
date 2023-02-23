import React from 'react'

import useUser from '../../util/auth'
import ApplicantHome from './ApplicantHome/ApplicantHome'
import RecruiterHome from './RecruiterHome/RecruiterHome'

/**
 * Component for rendering recruiter home component or applicant home component
 */
export default function Home() {
  const [user] = useUser()
  if (user === null) return null
  return user.role === 'recruiter' ? <RecruiterHome /> : <ApplicantHome />
}
