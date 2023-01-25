import { Typography } from '@mui/material'
import React from 'react'
import useUser from '../../util/auth'
import ApplicantHome from './ApplicantHome/ApplicantHome'

export default function Home() {
  const [user] = useUser()
  return (
    <div>
      <Typography variant="h1">Home</Typography>
      <ApplicantHome />
    </div>
  )
}
