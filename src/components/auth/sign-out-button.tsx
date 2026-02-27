
"use client"

import { handleSignOut } from "@/actions/auth-actions"
import { Button } from "@mui/material";

export function SignOutButton() {
  return (
    <Button onClick={() => handleSignOut()} sx={{ color: "white" }} variant="text">
        Log Out
    </Button>
  )
}
