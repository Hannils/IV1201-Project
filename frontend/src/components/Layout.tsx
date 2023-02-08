import { AccountCircleRounded, LogoutRounded } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import React, { ReactElement, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import useUser from '../util/auth'
import UserAvatar from './UserAvatar'

interface LayoutProps {
  children?: ReactElement
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  const [user] = useUser()
  const navigate = useNavigate()

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const avatarRef = useRef(null)

  function onClicker(cb?: CallableFunction): React.MouseEventHandler {
    return (e) => {
      setIsProfileOpen(false)
      cb !== undefined && cb(e)
    }
  }

  return (
    <Box pt={12}>
      <AppBar sx={{ zIndex: 100 }}>
        <Stack
          px={4}
          py={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to="/">
            <Typography variant="h4" component="span">
              Recruitment Application
            </Typography>
          </Link>
          <IconButton size="small" ref={avatarRef} onClick={() => setIsProfileOpen(true)}>
            {user === null ? (
              <AccountCircleRounded fontSize="large" />
            ) : (
              <UserAvatar user={user} />
            )}
          </IconButton>
        </Stack>
        <Menu
          PaperProps={{
            sx: { maxWidth: 300, width: '75%' },
          }}
          anchorEl={avatarRef.current}
          id="account-menu"
          open={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        >
          <MenuItem disabled sx={{ pointerEvents: 'none' }}>
            {user === null
              ? 'Not signed in'
              : `Signed in as ${user.username || user.email}`}
          </MenuItem>
          <Divider />
          {user === null ? (
            <MenuItem component={Link} to="/signin" onClick={onClicker()}>
              Sign in
            </MenuItem>
          ) : (
            <MenuItem component={Link} to="/account" onClick={onClicker()}>
              <ListItemIcon>
                <AccountCircleRounded />
              </ListItemIcon>
              Account
            </MenuItem>
          )}
          {user === null ? (
            <MenuItem component={Link} to="/signup" onClick={onClicker()}>
              Create an account
            </MenuItem>
          ) : (
            <MenuItem onClick={onClicker(() => navigate('/signin'))}>
              <ListItemIcon>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          )}
        </Menu>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </Box>
  )
}
