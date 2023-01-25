import React from 'react'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function Layout({ children }: any) {
  return (
    <Container>
      <Outlet />
    </Container>
  )
}
