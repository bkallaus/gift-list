"use client";
import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import AddMember from "../member/add-member";
import { GiftsQuery, Remove_Member } from "./group-queries";

type Member = {
  email: string;
  firstName: string;
  lastName: string;
};

const EditGroup = ({ groupSlug }: { groupSlug: string }) => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const [removeMutation] = useMutation(Remove_Member);
  const { data } = useQuery(GiftsQuery, {
    variables: {
      groupSlug,
    },
  });

  const onRemoveMember = (email: string) => {
    removeMutation({
      variables: {
        groupSlug,
        email,
      },
      refetchQueries: [GiftsQuery],
    });
  };

  return (
    <Box>
      <Typography variant="h2">{data?.group?.name}</Typography>
      <Typography variant="h3">{data?.group?.description}</Typography>
      <Typography variant="h4">{data?.group?.limit}</Typography>
      <Button onClick={() => setOpen(true)}>Add Member</Button>
      {data?.group?.members.map((member: Member) => (
        <Box key={member.email} display={"flex"}>
          <Typography fontWeight={500}>
            {member.firstName} {member.lastName} ({member.email})
          </Typography>
          {user?.email !== member.email && (
            <Button onClick={() => onRemoveMember(member.email)}>Remove</Button>
          )}
        </Box>
      ))}
      <AddMember setOpen={setOpen} open={open} groupSlug={groupSlug} />
    </Box>
  );
};

export default EditGroup;
