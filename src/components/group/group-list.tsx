"use client";
import { Box, Button, Typography } from "@mui/material";
import { GroupsQuery, Group } from "./group-queries";
import AddGroup from "./add-group";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery } from "@apollo/client";

const GroupList = () => {
  const { user } = useUser();

  const { data, error, loading } = useQuery(GroupsQuery);
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Box sx={{ display: "flex" }}>
        <Button href="/api/auth/login">Login to see list</Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection={"column"} gap={3}>
      <Button onClick={() => setOpen(true)}>Add Group</Button>
      {data?.groups.map((group: Group) => (
        <Link key={group.name} href={`/group/${group.slug}`}>
          <Box>
            <Typography>
              {group.name} (
              {group.limit?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
            )<Typography>{group.description}</Typography>
          </Box>
        </Link>
      ))}
      <AddGroup open={open} setOpen={setOpen} />
    </Box>
  );
};

export default GroupList;
