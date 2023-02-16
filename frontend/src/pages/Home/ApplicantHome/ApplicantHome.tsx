import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { Application, CompetenceProfile } from '../../../util/Types'
import {
  ArrowForwardIosRounded,
  DateRangeRounded,
  HandshakeRounded,
  SchoolRounded,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import api from '../../../api/api'
import { useAuthedUser } from '../../../components/WithAuth'

const pages = [
  {
    link: '/competences',
    heading: 'Your competences',
    text: 'View and update your current competences',
    Icon: SchoolRounded,
  },
  {
    link: '/availability',
    heading: 'Availability',
    text: 'View and update your availability',
    Icon: DateRangeRounded,
  },
  {
    link: '/applications',
    heading: 'Applications',
    text: 'View your Applications',
    Icon: HandshakeRounded,
  },
]

export default function ApplicantHome() {
  const { firstname } = useAuthedUser()
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h1">Welcome {firstname}!</Typography>
        <Typography>Lorem ipsum dolor sit amet</Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        }}
      >
        {pages.map(({ link, heading, text, Icon }) => (
          <Card>
            <CardActionArea component={Link} to={link}>
              <CardMedia sx={{ p: 2, display: 'grid', placeItems: 'center' }}>
                <Icon color="primary" sx={{ fontSize: 70 }} />
              </CardMedia>
              <CardContent>
                <Typography variant="h2" gutterBottom>
                  {heading}
                </Typography>
                <Typography>{text}</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button component={Link} to={link} endIcon={<ArrowForwardIosRounded />}>
                View page
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Stack>
  )
}
