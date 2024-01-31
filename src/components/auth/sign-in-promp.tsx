import { Alert, Button } from "@mui/material";
import React from "react";

export const SignInPrompt = () => {
  return (
    <Alert severity="warning">
      <Button variant="contained" href="/api/auth/login">
        Log In to manage your list
      </Button>
    </Alert>
  );
};
