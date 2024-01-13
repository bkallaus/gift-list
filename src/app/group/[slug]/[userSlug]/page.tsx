import * as React from "react";
import Box from "@mui/material/Box";
import { List } from "@/components/list/list";

export default function HomePage({ params }) {
  return (
    <Box sx={{ display: "flex" }}>
      <List userSlug={params.userSlug} groupSlug={params.slug} />
    </Box>
  );
}
