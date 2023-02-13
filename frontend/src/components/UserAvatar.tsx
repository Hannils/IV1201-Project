import { Avatar, AvatarProps, Skeleton } from '@mui/material'
import React, { forwardRef, ForwardRefRenderFunction, useMemo } from 'react'

import { Person } from '../util/Types'

/**
 * user: The userdata of the user for the avatar
 * isLoading: if it should render a loading animation
 */
interface UserAvatarProps extends AvatarProps {
  user: Person
  isLoading?: boolean
}

type UserAvatarRenderer = ForwardRefRenderFunction<HTMLDivElement, UserAvatarProps>

/**
 * User avatar compoent will render an avatar for a user, showing their initials if available
 * @param props data for the component to render {@link UserAvatarProps}
 */
const UserAvatar: UserAvatarRenderer = (props, ref) => {
  const { user, isLoading, ...AvatarProps } = props
  const initials = useMemo<string>(
    () => (user === null ? '' : (user.firstname[0] + user.lastname[0]).toUpperCase()),
    [user],
  )

  if (isLoading) {
    return (
      <Avatar sx={{ bgcolor: 'transparent', ...AvatarProps.sx }} {...AvatarProps}>
        <Skeleton variant="circular" animation="wave" width="100%" height="100%" />
      </Avatar>
    )
  }

  return (
    <Avatar ref={ref} {...AvatarProps}>
      {initials}
    </Avatar>
  )
}

/**
 * Forward the ref if any implementations wants to anchor to the avatar
 */
export default forwardRef<HTMLDivElement, UserAvatarProps>(UserAvatar)
