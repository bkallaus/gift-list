"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Typography>My Profie</Typography>
      <Typography>{user.name}</Typography>
      <Typography>{user.email}</Typography>
    </Box>
  );
}
