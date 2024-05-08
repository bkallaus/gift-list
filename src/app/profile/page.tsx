import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getUserProfileData } from "@/services/user-service";

const Profile = async () => {
  const user = await getUserProfileData();

  return (
    <Box>
      <Typography>My Profile</Typography>
      <Typography>{user.name}</Typography>
      <Typography>{user.email}</Typography>
    </Box>
  );
};

export default Profile;
