'use client';
import { Paper, Typography } from "@mui/material";
import { Spacing } from "../spacing";
import GoogleSignIn from "./google-sign-in-button";

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
      <GoogleSignIn />
    </Paper>
  );
};
