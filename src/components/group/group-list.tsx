"use client";
import { gql, useQuery } from "@apollo/client";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import AddGroup from "./add-group";

const GiftsQuery = gql`
  query {
    groups {
      name
      description
      limit
      members {
        email
        firstName
        lastName
      }
    }
  }
`;

const GroupList = () => {
  const { data, error, loading } = useQuery(GiftsQuery);
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button onClick={() => setOpen(true)}>Add Group</Button>
      {data?.groups.map((group: any) => (
        <Box key={group.name}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
        </Box>
      ))}
      <AddGroup open={open} setOpen={setOpen} />
    </Box>
  );
};

export default GroupList;
