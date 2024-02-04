import * as React from "react";
import Box from "@mui/material/Box";
import { List } from "@/components/list/list";
import { getUserProfileData } from "@/services/user-service";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { graphqlQuery } from "@/gql/graphql";

const UserQuery = `
  query User($userSlug: String!) {
    user(slug: $userSlug) {
      slug
      email
      firstName
      lastName
    }
  }
`;

const ListGroupPage = async ({
  params,
}: {
  params: {
    slug: string;
    userSlug: string;
  };
}) => {
  const user = await getUserProfileData();
  const userData = await graphqlQuery(UserQuery, {
    userSlug: params.userSlug,
  });

  const listUser = userData?.data?.user as {
    slug: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  return (
    <Box sx={{ margin: "auto" }}>
      <List
        userSlug={params.userSlug}
        groupSlug={params.slug}
        user={user}
        listUser={{ ...listUser }}
      />
    </Box>
  );
};

export default withPageAuthRequired(ListGroupPage, { returnTo: "/group" });
