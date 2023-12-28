import * as React from "react";
import Box from "@mui/material/Box";
import { List } from "@/components/list/list";
import { Typography } from "@mui/material";
import GroupList from "@/components/group/group-list";

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h1">Groups</Typography>
      <GroupList />
    </Box>
  );
}
