import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Box>
      <Typography>Gift Exchange Website</Typography>
      <Button LinkComponent={Link} href="/list">
        My List
      </Button>
    </Box>
  );
}
