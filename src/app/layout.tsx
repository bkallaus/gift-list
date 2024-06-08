import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AppBar, Box, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { ApolloWrapper } from "@/components/apollo-wrapper";
import Link from "next/link";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "@/theme";

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
      <body
        style={{
          backgroundColor: "#24695C1A",
        }}
      >
        <ApolloWrapper>
          <UserProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <body>
                  <AppBar position="fixed" component="nav">
                    <Toolbar>
                      <Link
                        href="/"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <Typography color="white">Gift Exchange</Typography>
                      </Link>
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: { xs: "none", sm: "block" },
                          margin: "auto",
                        }}
                      >
                        <Box
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"center"}
                          gap={3}
                        >
                          <Link
                            href="/list"
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <Typography color="white">My List</Typography>
                          </Link>
                          <Link
                            href="/group"
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <Typography color="white">My Groups</Typography>
                          </Link>
                        </Box>
                      </Box>
                      <AuthButtons />
                    </Toolbar>
                  </AppBar>
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      mx: { lg: "240px" },
                      mt: ["48px", "56px", "64px"],
                      p: 3,
                    }}
                  >
                    {children}
                  </Box>
                </body>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </UserProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
