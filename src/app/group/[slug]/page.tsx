import * as React from "react";
import Box from "@mui/material/Box";
import EditGroup from "@/components/group/edit-group";
import { getUserProfileData } from "@/services/user-service";

export default async function HomePage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const user = await getUserProfileData();

  return (
    <Box>
      <EditGroup groupSlug={params.slug} user={user} />
    </Box>
  );
}
