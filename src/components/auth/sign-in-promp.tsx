"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Alert, Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export const SignInPrompt = () => {
  const { user } = useUser();

  if (user) {
    return null;
  }

  return (
    <Alert severity="warning">
      <Button variant="contained" href="/api/auth/login">
        Log In to manage your list
      </Button>
    </Alert>
  );
};
