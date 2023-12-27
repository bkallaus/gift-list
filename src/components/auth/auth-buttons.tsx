"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Box, Button } from "@mui/material";
import React from "react";

export const AuthButtons = () => {
  const { user } = useUser();

  return (
    <div>
      {!user && (
        <>
          <Button variant="contained" href="/api/auth/login">
            Log In
          </Button>
        </>
      )}
      {user && (
        <div>
          <span
            style={{
              color: "black",
            }}
          >
            {user.name} - {user.email}
          </span>
          <Button variant="contained" href="/api/auth/logout">
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};
