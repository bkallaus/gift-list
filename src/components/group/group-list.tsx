"use client";
import { Box, Button, Typography } from "@mui/material";
import { Group } from "./group-queries";
import AddGroup from "./add-group";
import Link from "next/link";
import { useState } from "react";

const GroupList = ({ groups }: { groups: Group[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box display="flex" flexDirection={"column"} gap={3}>
      {groups.map((group: Group) => (
        <Link
          key={group.name}
          href={`/group/${group.slug}`}
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <Box
            border={"1px solid gainsboro"}
            borderRadius={3}
            p={3}
            sx={{
              "&:hover": {
                backgroundColor: "gainsboro",
              },
            }}
          >
            <Typography
              fontSize={24}
              fontWeight={600}
              sx={{
                textDecoration: "none",
                color: "black",
              }}
            >
              {group.name}
            </Typography>
            <Typography>
              Gift Limit:{" "}
              {group.limit?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
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
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Group
        </Button>
      </Box>
      <AddGroup open={open} setOpen={setOpen} />
    </Box>
  );
};

export default GroupList;
