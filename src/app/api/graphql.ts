import {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQueryType",
		fields: {
			hello: {
				type: GraphQLString,
				resolve() {
					return "world";
				},
			},
		},
	}),
});

export const POST = async (request: Request) => {
	const result = await graphql({
		source: request.blob(),
		schema,
		contextValue: {
			email: "b.m.kallaus@gmail.com",
		},
	});

	return Response.json(result);
};
