import {
  ArrowForwardIosRounded,
  DateRangeRounded,
  HandshakeRounded,
  SchoolRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router-dom'

import api from '../../../api/api'
import ErrorHandler from '../../../components/ErrorHandler'
import { useAuthedUser } from '../../../components/WithAuth'
import { Opportunity } from '../../../util/Types'

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

const timeFormatter = new Intl.RelativeTimeFormat('en', { style: 'short' })
const dayInMilis = 1000 * 60 * 60 * 24

/**
 * Component for applicant home
 */
export default function ApplicantHome() {
  const { firstname } = useAuthedUser()
  const {
    data: opportunities,
    isError,
    error,
  } = useQuery<Opportunity[] | null[]>(['opportunity'], () => api.getOpportunities(), {
    placeholderData: new Array(2).fill(null),
  })

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
          <Card key={link}>
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
      <Box>
        <Container maxWidth="sm">
          <Typography variant="h1">Open opportunities</Typography>
          <ErrorHandler size="large" isError={isError} error={error} />
          {!isError &&
            opportunities !== undefined &&
            (opportunities.length === 0 ? (
              <Typography>No open opportunities right now. Check back later.</Typography>
            ) : (
              <List>
                {opportunities.map((opp, index) => (
                  <ListItemButton
                    key={index}
                    disabled={opp === null}
                    component={Link}
                    to={`/opportunity/${opp?.opportunityId}`}
                  >
                    {opp === null ? (
                      <Skeleton width="100%" height="70px" />
                    ) : (
                      <ListItemText
                        primary={opp.name}
                        secondary={
                          'Application period ends ' +
                          timeFormatter.format(
                            Math.round(
                              (opp.applicationPeriodEnd.getTime() - Date.now()) /
                                dayInMilis,
                            ),
                            'days',
                          )
                        }
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            ))}
        </Container>
      </Box>
    </Stack>
  )
}
