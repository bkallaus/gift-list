"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Person } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export const AuthButtons = () => {
  const { user } = useUser();

  return (
    <Box>
      {!user && (
        <>
          <Button variant="contained" href="/api/auth/login">
            Log In
          </Button>
        </>
      )}
      {user && (
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
          {/* <Button href="/api/auth/logout">Log Out</Button> */}
        </Box>
      )}
    </Box>
  );
};
