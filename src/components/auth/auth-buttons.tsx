import { getSession } from "@auth0/nextjs-auth0";
import { Person } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

export const AuthButtons = async () => {
  const session = await getSession();

  if (!session) {
    return (
      <Box>
        <Button variant="contained" href="/api/auth/login">
          Log In
        </Button>
      </Box>
    );
  }

  const user = session.user;

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      gap={1}
      flex={1}
      justifyContent={"flex-end"}
    >
      <Button
        variant="outlined"
        href="/profile"
        sx={{ color: "white" }}
        startIcon={<Person sx={{ color: "white" }} />}
      >
        {user.name}
      </Button>
      <Button sx={{ color: "white" }} variant="text" href="/api/auth/logout">
        Log Out
      </Button>
    </Box>
  );
};
