import { AccountCircleRounded, LogoutRounded } from '@mui/icons-material'
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import api from '../api/api'
import useUser from '../util/auth'
import ErrorHandler from './ErrorHandler'
import UserAvatar from './UserAvatar'

/** 
* The layout compoent is rendered for all pages.
* It contains global UI elements.
*/
export default function Layout() {
  const [user, , setUser] = useUser()
  const signoutMutation = useMutation({
    mutationFn: () => api.signOut(),
    onSuccess: () => {
      setIsProfileOpen(false)
      setUser(null)
    },
  })

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
          ) : null}
          {user === null ? (
            <MenuItem component={Link} to="/signup" onClick={onClicker()}>
              Create an account
            </MenuItem>
          ) : (
            <MenuItem onClick={() => signoutMutation.mutate()}>
              <ListItemIcon>
                {signoutMutation.isLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <LogoutRounded fontSize="small" />
                )}
              </ListItemIcon>
              Sign out
            </MenuItem>
          )}
          {signoutMutation.isError && (
            <MenuItem sx={{ pointerEvents: 'none' }}>
              <ErrorHandler size="small" isError={true} error={signoutMutation.error} />
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
