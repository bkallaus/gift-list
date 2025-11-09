import { graphqlQuery } from "@/gql/graphql";

export const POST = async (request: Request) => {
	const json = await request.json();

	const result = await graphqlQuery(json.query, json.variables);

	return Response.json(result);
};
