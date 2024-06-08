"use server";
import { graphqlQuery } from "@/gql/graphql";
import { redirect } from "next/navigation";

const ADD_GROUP_MUTATION = `
  mutation AddGroup($name: String!, $limit: Float!, $description: String) {
    addGroup(name: $name, limit: $limit, description: $description) {
      slug
    }
  }
`;

export const addGroupServer = async (values: {
	name: string;
	limit: number;
	description: string;
}) => {
	const data = await graphqlQuery(ADD_GROUP_MUTATION, {
		name: values.name,
		limit: Number(values.limit),
		description: values.description,
	});

	console.log(data);

	if (data.errors) {
		console.error(data.errors);

		return { errors: data.errors };
	}

	const slug = (data.data as { addGroup: { slug: string } }).addGroup.slug;

	redirect(`/group/${slug}`);
};
