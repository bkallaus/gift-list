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
      {data?.groups.map((group: Group) => (
        <Link key={group.name} href={`/group/${group.slug}`}>
          <Box border={"1px solid black"} borderRadius={3} p={3}>
            <Typography
              fontSize={24}
              fontWeight={600}
              sx={{
                textDecoration: "none",
                color: "black",
              }}
            >
              {group.name} (
              {group.limit?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
              )
            </Typography>
            <Typography
              sx={{
                textDecoration: "none",
                color: "black",
              }}
            >
              {group.description}
            </Typography>
          </Box>
        </Link>
      ))}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Add Group
      </Button>
      <AddGroup open={open} setOpen={setOpen} />
    </Box>
  );
};

export default GroupList;
