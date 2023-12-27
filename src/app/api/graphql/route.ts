import {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLFloat,
	execute,
	GraphQLInt,
} from "graphql";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { executeQuery, getPool } from "@/services/database";
import { get } from "http";
import { exec } from "child_process";

const Group = new GraphQLObjectType({
	name: "Group",
	fields: {
		name: {
			type: GraphQLString,
			resolve() {
				return "group name";
			},
		},
		limit: {
			type: GraphQLFloat,
			resolve() {
				return 50.5;
			},
		},
		members: {
			type: new GraphQLList(GraphQLString),
			resolve() {
				return [];
			},
		},
	},
});

const Gift = new GraphQLObjectType({
	name: "Gift",
	fields: {
		id: {
			type: GraphQLInt,
		},
		title: {
			type: GraphQLString,
		},
		url: {
			type: GraphQLString,
		},
	},
});

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
			groups: {
				type: new GraphQLList(Group),
				resolve() {
					return [];
				},
			},
			gifts: {
				type: new GraphQLList(Gift),
				async resolve(src, _, ctx) {
					return executeQuery(
						"SELECT * FROM public.user_gifts ug join public.users u on ug.user_id = u.user_id where u.email = $1",
						[ctx.user.email],
					);
				},
			},
		},
	}),
	mutation: new GraphQLObjectType({
		name: "RootMutationType",
		fields: {
			addGift: {
				type: Gift,
				args: {
					title: {
						type: GraphQLString,
					},
					url: {
						type: GraphQLString,
					},
				},
				async resolve(_, args, ctx) {
					const sql =
						"INSERT INTO public.user_gifts (user_id, title, url) VALUES ((select user_id from public.users where email = $1), $2, $3) returning *";
					const values = [ctx.user.email, args.title, args.url];
					const result = await executeQuery(sql, values);

					return result ? result[0] : null;
				},
			},
			removeGift: {
				type: Gift,
				args: {
					giftId: {
						type: GraphQLInt,
					},
					giftTitle: {
						type: GraphQLString,
					},
				},
				async resolve(_, args, ctx) {
					const [gift] = await executeQuery(
						"SELECT * FROM public.user_gifts WHERE id = $1 and user_id = (select user_id from public.users where email = $2)",
						[args.giftId, ctx.user.email],
					);

					if (!gift) {
						return null;
					}

					if (args.giftTitle) {
						const sql =
							"DELETE FROM public.user_gifts WHERE title = $1 and user_id = (select user_id from public.users where email = $2)";
						const values = [args.giftTitle, ctx.user.email];
						await executeQuery(sql, values);
					} else {
						const sql =
							"DELETE FROM public.user_gifts WHERE id = $1 and user_id = (select user_id from public.users where email = $2)";
						const values = [args.giftId, ctx.user.email];
						await executeQuery(sql, values);
					}

					return gift;
				},
			},
		},
	}),
});

export const POST = withApiAuthRequired(async (request) => {
	const json = await request.json();
	const res = new NextResponse();
	const session = await getSession(request, res);
	const result = await graphql({
		source: json.query,
		schema,
		contextValue: {
			user: session?.user,
		},
		variableValues: json.variables,
	});

	return Response.json(result);
});
