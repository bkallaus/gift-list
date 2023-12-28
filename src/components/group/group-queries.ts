import { gql } from "@apollo/client";

export type Group = {
	id: string;
	name: string;
	description: string;
	limit: number;
	slug: string;
	members: string[];
};

export const GiftsQuery = gql`
  query GiftsQuery($groupSlug: String!) {
    group(groupSlug: $groupSlug) {
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

export const GetGroup = gql`
  query GetGroup($groupSlug: String!) {
    group(groupSlug: $groupSlug) {
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

export const GroupsQuery = gql`
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

export const Add_Member = gql`
mutation AddMember(
  $groupSlug: String!
  $email: String!
  $firstName: String!
  $lastName: String!
) {
  addMember(
    groupSlug: $groupSlug
    email: $email
    firstName: $firstName
    lastName: $lastName
  ) {
    email
    firstName
    lastName
  }
}
`;

export const Remove_Member = gql`
  mutation RemoveMember($groupSlug: String!, $email: String!) {
    removeUserFromGroup(groupSlug: $groupSlug, email: $email) {
      email
    }
  }
`;
