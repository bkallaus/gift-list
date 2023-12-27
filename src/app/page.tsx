import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useUser } from "@auth0/nextjs-auth0/client";
import AddEditGroup from "@/components/group/add-edit-group";

export default function HomePage() {
  return (
    <Box sx={{ display: "flex" }}>
      <div>This app uses the Next.js App Router and Material UI v5.</div>
      <AddEditGroup />
    </Box>
  );
}
