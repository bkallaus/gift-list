import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { AuthButtons } from "@/components/auth/auth-buttons";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ThemeRegistry>
            <body>
              <AppBar position="fixed" sx={{ zIndex: 2000 }}>
                <Toolbar sx={{ backgroundColor: "background.paper" }}>
                  <Typography variant="h6" color="text.primary">
                    Gift Exchange
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
      </body>
    </html>
  );
}
