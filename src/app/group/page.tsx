import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import GroupList from "@/components/group/group-list";
import { Spacing } from "@/components/spacing";
import { graphqlQuery } from "@/gql/graphql";
import { getUserProfileData } from "@/services/user-service";

const GroupsQuery = `
  query {
    groups {
      name
      slug
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

const GroupPage = async () => {
  await getUserProfileData();

  const {
    data: { groups },
  } = (await graphqlQuery(GroupsQuery)) as { data: { groups: any } };

  return (
    <Box>
      <Typography fontSize={48} fontWeight={500}>
        Groups
      </Typography>
      <Typography>
        View and manage all gift giving groups you are a part of.
      </Typography>
      <Spacing />
      <GroupList groups={JSON.parse(JSON.stringify(groups))} />
    </Box>
  );
};

export default GroupPage;
