
"use client"

import { handleSignIn } from "@/actions/auth-actions"
import { Button } from "@mui/material";

export default function SignIn() {
  return (
    <Button onClick={() => handleSignIn()} variant="outlined">Sign in with Google</Button>
  )
}
