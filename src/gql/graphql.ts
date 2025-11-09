import { graphql } from "graphql";
import { schema } from "./schema";
import { getUser } from "@/services/verify-credentials";

export const graphqlQuery = async (
	query: string,
	variables?: any,
	session?: any,
) => {
	const user = await getUser();

	if (!user) {
		throw new Error("Unauthorized");
	}
	console.log(user)

	const result = await graphql({
		source: query,
		schema,
		contextValue: {
			user: user,
		},
		variableValues: variables,
	});

	return result;
};
