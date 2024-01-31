import { getSession } from "@auth0/nextjs-auth0";
import { Person } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Link from "next/link";
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
    <Box>
      <Box>
        <Link
          href="/profile"
          style={{
            textDecoration: "none",
            color: "black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {user.name}
          <Person />
        </Link>
        <Button href="/api/auth/logout">Log Out</Button>
      </Box>
    </Box>
  );
};
