import { Avatar, AvatarProps, Skeleton } from '@mui/material'
import React, { forwardRef, useMemo } from 'react'

import { Person } from '../util/Types'

interface UserAvatarProps extends AvatarProps {
  user: Person
  isLoading?: boolean
}

export default forwardRef<HTMLDivElement, UserAvatarProps>(function UserAvatar(
  { user, isLoading, ...props },
  ref,
) {
  const initials = useMemo<string>(
    () => (user === null || user.username === null ? '' : getInitials(user.username)),
    [user],
  )

  if (isLoading) {
    return (
      <Avatar sx={{ bgcolor: 'transparent' }}>
        <Skeleton variant="circular" animation="wave" width="100%" height="100%" />
      </Avatar>
    )
  }

  return (
    <Avatar ref={ref} {...props}>
      {initials}
    </Avatar>
  )
})

function getInitials(name: string): string {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
  const initials = [...name.matchAll(rgx)] || []

  return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase()
}
