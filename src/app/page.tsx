import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { SignInPrompt } from "@/components/auth/sign-in-promp";
import { Spacing } from "@/components/spacing";
import { getSession } from "@auth0/nextjs-auth0";
import { BorderedPaper } from "@/components/bordered-paper";

export const metadata = {
  title: "Gift Exchange Website",
  description: "This is a website to help you manage your gift exchange list.",
  openGraph: {
    title: "Gift Exchange Website",
    description:
      "This is a website to help you manage your gift exchange list.",
  },
};

const HomePage = async () => {
  const session = await getSession();

  return (
    <div>
      <Box py={10} bgcolor={""}>
        <Typography fontSize={48}>Gift Exchange Website</Typography>
        <span className="text-pink">
          This is a website to help you manage your gift exchange list.
        </span>
      </Box>
      {!session ? (
        <SignInPrompt />
      ) : (
        <>
          <Link
            href="/list"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <BorderedPaper
              sx={{
                "&:hover": {
                  backgroundColor: "gainsboro",
                },
              }}
            >
              <Typography fontSize={24} fontWeight={400}>
                My List
              </Typography>
              <Typography>Manage your list</Typography>
            </BorderedPaper>
          </Link>
          <Spacing />
          <Link
            href="/group"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <BorderedPaper
              sx={{
                "&:hover": {
                  backgroundColor: "gainsboro",
                },
              }}
            >
              <Typography fontSize={24} fontWeight={400}>
                My Groups
              </Typography>
              <Typography>
                View groups your in as well as gifts of those in your groups
              </Typography>
            </BorderedPaper>
          </Link>
        </>
      )}
    </div>
  );
};

export default HomePage;
