import { Person } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import GoogleSignIn from "./google-sign-in-button";
import { getUser } from "@/services/verify-credentials";
import { SignOutButton } from "./sign-out-button";
export const AuthButtons =  async () => {

  const user = await getUser();

  if (!user) {
    return (
      null
    );
  }

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      gap={1}
      flex={1}
      justifyContent={"flex-end"}
    >
      <Button
        variant="outlined"
        href="/profile"
        sx={{ color: "white" }}
        startIcon={<Person sx={{ color: "white" }} />}
      >
        {user.name}
      </Button>
      <SignOutButton />
    </Box>
  );
};
