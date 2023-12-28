import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import EditGroup from "@/components/group/edit-group";

export default function HomePage({ params }) {
  return (
    <Box>
      <EditGroup groupSlug={params.slug} />
    </Box>
  );
}
