'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

const Avatar = React.forwardRef(function Avatar({ className, ...props }, ref) {
    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={"avatarRoot" + (className ? " " + className : "")}
            {...props}
        />
    )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(function AvatarImage(
    { className, ...props },
    ref
) {
    return (
        <AvatarPrimitive.Image
            ref={ref}
            className={"avatarImage" + (className ? " " + className : "")}
            {...props}
        />
    )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(function AvatarFallback(
    { className, ...props },
    ref
) {
    return (
        <AvatarPrimitive.Fallback
            ref={ref}
            className={"avatarFallback" + (className ? " " + className : "")}
            {...props}
        />
    )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
