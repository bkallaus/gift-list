import * as React from "react";
import Box from "@mui/material/Box";
import EditGroup from "@/components/group/edit-group";

export default function HomePage({ params }: { params: { slug: string } }) {
  return (
    <Box>
      <EditGroup groupSlug={params.slug} />
    </Box>
  );
}
