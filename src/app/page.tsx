import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Paper } from "@mui/material";
import Link from "next/link";
import { SignInPrompt } from "@/components/auth/sign-in-promp";
import { Spacing } from "@/components/spacing";

export default function HomePage() {
  return (
    <Box>
      <Box py={10} bgcolor={""}>
        <Typography fontSize={48}>Gift Exchange Website</Typography>
        <Typography>
          This is a website to help you manage your gift exchange list.
        </Typography>
      </Box>
      <SignInPrompt />
      <Link href="/list">
        <Box
          p={5}
          border={"1px solid black"}
          borderRadius={3}
          sx={{ textDecoration: "none", color: "black" }}
        >
          <Typography fontSize={24} fontWeight={400}>
            My List
          </Typography>
          <Typography>Manage your list</Typography>
        </Box>
      </Link>
      <Spacing />
      <Link href="/group">
        <Box
          p={5}
          border={"1px solid black"}
          borderRadius={3}
          sx={{ textDecoration: "none", color: "black" }}
        >
          <Typography fontSize={24} fontWeight={400}>
            My Groups
          </Typography>
          <Typography>
            View groups your in as well as gifts of those in your groups
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}
