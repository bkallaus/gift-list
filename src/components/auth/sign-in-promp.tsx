
"use client"

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
      <Typography variant="body1" sx={{ mb: 1 }}>
        Join your friends and family in making gift-giving easier and more organized.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to create your wish list, join gift exchange groups, and start sharing the joy of giving.
      </Typography>
      <Spacing />
      <GoogleSignIn />
    </Paper>
  );
};
