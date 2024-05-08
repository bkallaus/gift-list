import * as React from "react";
import Box from "@mui/material/Box";
import EditGroup from "@/components/group/edit-group";
import { getUserProfileData } from "@/services/user-service";

export default async function HomePage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getUserProfileData();

  return (
    <Box>
      <EditGroup groupSlug={params.slug} user={user} />
    </Box>
  );
}
