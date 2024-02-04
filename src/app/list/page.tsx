import * as React from "react";
import Box from "@mui/material/Box";
import { List } from "@/components/list/list";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getUserProfileData } from "@/services/user-service";

const HomePage = async () => {
  const user = await getUserProfileData();

  return (
    <Box sx={{ margin: "auto" }}>
      <List user={user} />
    </Box>
  );
};

export default withPageAuthRequired(HomePage, { returnTo: "/list" });
