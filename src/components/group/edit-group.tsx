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
import { Claims } from "@auth0/nextjs-auth0";
import { join } from "path";
import { BorderedPaper } from "../bordered-paper";

type Member = {
  slug: string;
  email: string;
  firstName: string;
  lastName: string;
};

const EditGroup = ({
  groupSlug,
  user,
}: {
  groupSlug: string;
  user: Claims;
}) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  const [removeMutation] = useMutation(Remove_Member);
  const [removeGroupMutation] = useMutation(Remove_Group);
  const [assignNames] = useMutation(Assign_Names);

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
    setShowAssign(true);
    assignNames({
      variables: {
        groupSlug,
      },
    });
  };

  const recipient = data?.group?.giftReceipient;
  const isAdmin = data?.group?.isAdmin;

  return (
    <Box>
      <Typography fontSize={48} fontWeight={500} display={"flex"} gap={3}>
        {data?.group?.name}{" "}
        {isAdmin && <EditGroupModalButton group={data?.group} />}
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
      {isAdmin && (
        <Box display={"flex"} gap={3}>
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Add Member
          </Button>
          <Spacing />
          <Button variant="outlined" onClick={() => setShowConfirm(true)}>
            Delete Group
          </Button>
          <Spacing />
          <Button variant="outlined" onClick={onAssignNames}>
            Assign Names
          </Button>
        </Box>
      )}
      <Spacing />
      {loading && <LinearProgress />}
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {data?.group?.members.map((member: Member) => (
          <MemberCard
            key={member.email}
            member={member}
            onRemoveMember={onRemoveMember}
            isAdmin={isAdmin}
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

      <ConfirmDialog
        title={"Assign Names"}
        description={
          "Are you sure you want to assign names? This will override existing assignees."
        }
        setOpen={setShowAssign}
        open={showAssign}
        confirmAction={() => {
          assignNames({
            variables: {
              groupSlug,
            },
          });
        }}
      />
      <AddMember setOpen={setOpen} open={open} groupSlug={groupSlug} />
    </Box>
  );
};

const MemberCard = ({
  member,
  onRemoveMember,
  isAdmin,
  isDrawnName,
  userEmail,
  groupSlug,
}: {
  member: Member;
  onRemoveMember: (email: string) => void;
  isAdmin: boolean;
  isDrawnName: boolean;
  userEmail: string;
  groupSlug: string;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const isSelf = userEmail === member.email;

  return (
    <BorderedPaper
      key={member.email}
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "gainsboro",
        },
      }}
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
      {!isSelf && isAdmin && (
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
    </BorderedPaper>
  );
};

export default EditGroup;
