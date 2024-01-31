import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { graphqlQuery } from "@/gql/graphql";

export const POST = withApiAuthRequired(async (request) => {
	const json = await request.json();
	const res = new NextResponse();
	const session = await getSession(request, res);

	const result = await graphqlQuery(json.query, json.variables, session);

	return Response.json(result);
});
