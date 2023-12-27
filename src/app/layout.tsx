import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { ApolloWrapper } from "@/components/apollo-wrapper";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Gift Exchange</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <ApolloWrapper>
          <UserProvider>
            <ThemeRegistry>
              <body>
                <AppBar position="fixed" component="nav">
                  <Toolbar sx={{ backgroundColor: "background.paper" }}>
                    <Link
                      href="/"
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Typography color="text.primary">
                        Gift Exchange
                      </Typography>
                    </Link>
                    <Typography
                      sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                    >
                      &nbsp;
                    </Typography>
                    <AuthButtons />
                  </Toolbar>
                </AppBar>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    bgcolor: "background.default",
                    ml: "240px",
                    mt: ["48px", "56px", "64px"],
                    p: 3,
                  }}
                >
                  {children}
                </Box>
              </body>
            </ThemeRegistry>
          </UserProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
