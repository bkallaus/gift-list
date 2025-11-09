import * as React from "react";
import Box from "@mui/material/Box";
import { List } from "@/components/list/list";
import { getUserProfileData } from "@/services/user-service";

const HomePage = async () => {
  const user = await getUserProfileData();

  return (
    <Box>
      <List user={user} />
    </Box>
  );
};

export default HomePage;
