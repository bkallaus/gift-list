import { graphql } from "graphql";
import { schema } from "./schema";
import { getSession } from "@auth0/nextjs-auth0";

export const graphqlQuery = async (
	query: string,
	variables?: any,
	session?: any,
) => {
	let localSession = session;

	if (!localSession) {
		localSession = await getSession();
	}

	const result = await graphql({
		source: query,
		schema,
		contextValue: {
			user: localSession?.user,
		},
		variableValues: variables,
	});

	return result;
};
