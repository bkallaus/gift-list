import * as React from "react";
import Box from "@mui/material/Box";
import { List } from "@/components/list/list";

export default function HomePage() {
  return (
    <Box sx={{ display: "flex" }}>
      <List />
    </Box>
  );
}
