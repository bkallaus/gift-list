"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import AddMember from "../member/add-member";
import { GroupQuery, Remove_Member } from "./group-queries";

import DeleteIcon from "@mui/icons-material/Delete";
import { Spacing } from "../spacing";
import ConfirmDialog from "../confirm-dialog";
import EditGroupModalButton from "./edit-group-modal";

type Member = {
  email: string;
  firstName: string;
  lastName: string;
};

const EditGroup = ({ groupSlug }: { groupSlug: string }) => {
  const [open, setOpen] = useState(false);
  const [removeMutation] = useMutation(Remove_Member);
  const { user } = useUser();
  const { data, loading } = useQuery(GroupQuery, {
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
      refetchQueries: [GroupQuery],
    });
  };

  return (
    <Box>
      <Typography fontSize={48} fontWeight={500} display={"flex"} gap={3}>
        {data?.group?.name}
      </Typography>
      <Typography>{data?.group?.description}</Typography>
      <Typography>
        Gift Limit:{" "}
        {data?.group?.limit?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </Typography>
      <Spacing />
      <EditGroupModalButton group={data?.group} />
      <Spacing />
      {loading && <LinearProgress />}
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {data?.group?.members.map((member: Member) => (
          <MemberCard
            key={member.email}
            member={member}
            onRemoveMember={onRemoveMember}
            userEmail={user?.email || ""}
          />
        ))}
      </Box>
      <Spacing />
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Member
      </Button>
      <AddMember setOpen={setOpen} open={open} groupSlug={groupSlug} />
    </Box>
  );
};

const MemberCard = ({
  member,
  onRemoveMember,
  userEmail,
}: {
  member: Member;
  onRemoveMember: (email: string) => void;
  userEmail: string;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box
      key={member.email}
      display={"flex"}
      border={"1px solid black"}
      borderRadius={3}
      p={3}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Box>
        <Typography fontWeight={500}>
          {member.firstName || member.lastName
            ? ` ${member.firstName} ${member.lastName}`
            : member.email}
        </Typography>
        <Typography>{member.email}</Typography>
      </Box>
      {userEmail !== member.email && (
        <IconButton
          className="border-gray-400 border rounded p-3 float-right"
          onClick={() => setShowConfirm(true)}
        >
          <DeleteIcon />
        </IconButton>
      )}
      <ConfirmDialog
        title={"Remove Member"}
        description={`Are you sure you want to remove ${member.email}?`}
        setOpen={setShowConfirm}
        open={showConfirm}
        confirmAction={() => onRemoveMember(member.email)}
      />
    </Box>
  );
};

export default EditGroup;
