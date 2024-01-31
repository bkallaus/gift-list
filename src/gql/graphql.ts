import { graphql } from "graphql";
import { schema } from "./schema";

export const graphqlQuery = async (query: string, variables: any, session) => {
	const result = await graphql({
		source: query,
		schema,
		contextValue: {
			user: session?.user,
		},
		variableValues: variables,
	});

	return result;
};
