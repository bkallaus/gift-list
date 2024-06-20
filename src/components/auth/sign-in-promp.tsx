import { Spa } from "@mui/icons-material";
import { Alert, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { Spacing } from "../spacing";

export const SignInPrompt = () => {
  return (
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h2">Welcome!</Typography>
      <Typography>Get started by logging in to manage your list. </Typography>
      <Spacing />
      <Button variant="contained" href="/api/auth/login">
        Log In
      </Button>
    </Paper>
  );
};
