"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Assign_Names,
  GroupQuery,
  Remove_Group,
  Remove_Member,
} from "./group-queries";

import DeleteIcon from "@mui/icons-material/Delete";
import { Spacing } from "../spacing";
import ConfirmDialog from "../confirm-dialog";
import EditGroupModalButton from "./edit-group-modal";
import { useRouter } from "next/navigation";
import AddMember from "../member/add-member";

type Member = {
  slug: string;
  email: string;
  firstName: string;
  lastName: string;
};

const EditGroup = ({ groupSlug }: { groupSlug: string }) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [removeMutation] = useMutation(Remove_Member);
  const [removeGroupMutation] = useMutation(Remove_Group);
  const [assignNames] = useMutation(Assign_Names);
  const { user } = useUser();
  const navigation = useRouter();
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

  const onRemoveGroup = () => {
    removeGroupMutation({
      variables: {
        groupSlug,
      },
    });
    navigation.push("/group");
  };

  const onAssignNames = () => {
    assignNames({
      variables: {
        groupSlug,
      },
    });
  };

  const recipient = data?.group?.giftReceipient;

  return (
    <Box>
      <Typography fontSize={48} fontWeight={500} display={"flex"} gap={3}>
        {data?.group?.name}
      </Typography>
      <Typography>
        {recipient ? `My Drawn Name (${recipient?.email})` : "No Drawn Name"}
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
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Member
      </Button>
      <Spacing />
      <EditGroupModalButton group={data?.group} />
      <Spacing />
      <Button variant="outlined" onClick={() => setShowConfirm(true)}>
        Delete Group{" "}
      </Button>
      <Spacing />
      <Button variant="outlined" onClick={onAssignNames}>
        Assign Names{" "}
      </Button>
      <Spacing />
      {loading && <LinearProgress />}
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {data?.group?.members.map((member: Member) => (
          <MemberCard
            key={member.email}
            member={member}
            onRemoveMember={onRemoveMember}
            isDrawnName={recipient?.email === member.email}
            userEmail={user?.email || ""}
            groupSlug={groupSlug}
          />
        ))}
      </Box>
      <Spacing />
      <ConfirmDialog
        title={"Delete Group"}
        description={`Are you sure you want to remove ${data?.group.name}?`}
        setOpen={setShowConfirm}
        open={showConfirm}
        confirmAction={() => onRemoveGroup()}
      />
      <AddMember setOpen={setOpen} open={open} groupSlug={groupSlug} />
    </Box>
  );
};

const MemberCard = ({
  member,
  onRemoveMember,
  isDrawnName,
  userEmail,
  groupSlug,
}: {
  member: Member;
  onRemoveMember: (email: string) => void;
  isDrawnName: boolean;
  userEmail: string;
  groupSlug: string;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box
      key={member.email}
      display={"flex"}
      border={"1px solid gainsboro"}
      borderRadius={3}
      p={3}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Link
        href={`/group/${groupSlug}/${member.slug}`}
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <Box>
          <Typography fontWeight={500}>
            {member.firstName || member.lastName
              ? ` ${member.firstName} ${member.lastName}`
              : member.email}{" "}
            {isDrawnName && "(Drawn Name)"}
          </Typography>
          <Typography>{member.email}</Typography>
        </Box>
      </Link>
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
