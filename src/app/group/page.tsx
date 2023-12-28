import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import GroupList from "@/components/group/group-list";
import { Spacing } from "@/components/spacing";

export default function HomePage() {
  return (
    <Box>
      <Typography fontSize={48} fontWeight={500}>
        Groups
      </Typography>
      <Typography>
        View and manage all gift giving groups you are a part of.
      </Typography>
      <Spacing />
      <GroupList />
    </Box>
  );
}
