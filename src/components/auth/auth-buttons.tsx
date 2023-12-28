"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Box, Button } from "@mui/material";
import Link from "next/link";
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
          <Link
            href="/profile"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            {user.name}
          </Link>
          {/* <Button href="/api/auth/logout">Log Out</Button> */}
        </div>
      )}
    </div>
  );
};
