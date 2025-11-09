import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { SignInPrompt } from "@/components/auth/sign-in-promp";
import { Spacing } from "@/components/spacing";
import { BorderedPaper } from "@/components/bordered-paper";
import { hasAccess } from "@/services/verify-credentials";

export const metadata = {
  title: "Gift Exchange - Organize Your Holiday Gift Lists",
  description: "The easiest way to organize and manage your gift exchanges with family and friends. Create wish lists, join groups, and make gift-giving simple and fun.",
  openGraph: {
    title: "Gift Exchange - Organize Your Holiday Gift Lists",
    description:
      "The easiest way to organize and manage your gift exchanges with family and friends.",
  },
};

const HomePage = async () => {
  const session = await hasAccess();

  return (
    <div>
      <Box 
        display={'flex'} 
        justifyContent={'space-between'}
        alignItems={'center'}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={4}
        py={10}
      >
        <Box
          sx={{
            textAlign: "center",
            flex: 1,
          }}
        >
          <Typography fontSize={48} fontWeight={600} sx={{ mb: 2 }}>
            Welcome to Gift Exchange
          </Typography>
          <Typography fontSize={20} color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 1 }}>
            The easiest way to organize and manage your gift exchanges with family and friends.
          </Typography>
          <Typography fontSize={16} color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Create wish lists, join groups, and make gift-giving simple and fun this holiday season.
          </Typography>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Image 
            src={'/gift.png'} 
            width={400} 
            height={400} 
            alt="Gift exchange illustration"
            style={{
              objectFit: 'contain',
              borderRadius: 12,
            }} 
          />
        </Box>
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
              <Typography>Create and manage your wish list</Typography>
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
                View groups you're in as well as gifts of those in your groups
              </Typography>
            </BorderedPaper>
          </Link>
        </>
      )}
    </div>
  );
};

export default HomePage;
