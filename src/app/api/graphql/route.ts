import {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLFloat,
	GraphQLInt,
	GraphQLNonNull,
} from "graphql";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { executeQuery, getPool } from "@/services/database";
import { v4 } from "uuid";

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

const User = new GraphQLObjectType({
	name: "User",
	fields: {
		slug: {
			type: GraphQLString,
		},
		firstName: {
			resolve(src) {
				return src.first_name;
			},
			type: GraphQLString,
		},
		lastName: {
			resolve(src) {
				return src.last_name;
			},
			type: GraphQLString,
		},
		email: {
			type: GraphQLString,
		},
	},
});

const Group = new GraphQLObjectType({
	name: "Group",
	fields: {
		name: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		limit: {
			type: GraphQLFloat,
			resolve(src) {
				return src.gift_limit;
			},
		},
		slug: {
			type: GraphQLString,
		},
		members: {
			type: new GraphQLList(User),
			resolve(src, _, ctx) {
				const sql =
					"SELECT * FROM public.users u join public.user_groups ug on u.user_id = ug.user_id where ug.group_id = $1";
				const values = [src.group_id];

				return executeQuery(sql, values);
			},
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
				resolve(src, _, ctx) {
					return executeQuery(
						`SELECT g.* 
						FROM public.groups g 
						join public.user_groups ug on g.group_id = ug.group_id
						join public.users u on ug.user_id = u.user_id 
						where u.email = $1`,
						[ctx.user.email],
					);
				},
			},
			group: {
				type: Group,
				args: {
					groupSlug: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				async resolve(_, args, ctx) {
					const sql =
						"SELECT g.* FROM public.groups g join public.user_groups ug on g.group_id = ug.group_id join public.users u on ug.user_id = u.user_id where u.email = $1 and g.slug = $2";

					const values = [ctx.user.email, args.groupSlug];
					const result = await executeQuery(sql, values);

					return result ? result[0] : null;
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
			addGroup: {
				type: Group,
				args: {
					name: {
						type: GraphQLString,
					},
					description: {
						type: GraphQLString,
					},
					limit: {
						type: GraphQLFloat,
					},
				},
				async resolve(_, args, ctx) {
					const sql =
						"INSERT INTO public.groups (name, description, gift_limit, slug) VALUES ($1, $2, $3, $4) returning *";
					const values = [args.name, args.description, args.limit, v4()];
					const result = await executeQuery(sql, values);

					if (!result) {
						return null;
					}

					const group = result[0];

					await executeQuery(
						"INSERT INTO public.user_groups (user_id, group_id) VALUES ((select user_id from public.users where email = $1), $2)",
						[ctx.user.email, group.group_id],
					);

					return group;
				},
			},
			addMember: {
				type: User,
				args: {
					groupSlug: {
						type: new GraphQLNonNull(GraphQLString),
					},
					email: {
						type: new GraphQLNonNull(GraphQLString),
					},
					firstName: {
						type: GraphQLString,
					},
					lastName: {
						type: GraphQLString,
					},
				},
				async resolve(_, args, ctx) {
					let user = await executeQuery(
						"SELECT * FROM public.users where email = $1",
						[args.email],
					);

					if (!user[0]) {
						user = await executeQuery(
							"INSERT INTO public.users (email, slug, first_name, last_name) VALUES ($1, $2, $3, $4) returning *",
							[args.email, v4(), args.firstName, args.lastName],
						);
					}

					const sql =
						"INSERT INTO public.user_groups (user_id, group_id) VALUES ((select user_id from public.users where email = $1), (select group_id from public.groups where slug = $2))";
					const values = [args.email, args.groupSlug];

					await executeQuery(sql, values);

					return user;
				},
			},
			removeUserFromGroup: {
				type: User,
				args: {
					groupSlug: {
						type: new GraphQLNonNull(GraphQLString),
					},
					email: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				async resolve(_, args, ctx) {
					const sql =
						"DELETE FROM public.user_groups WHERE user_id = (select user_id from public.users where email = $1) and group_id = (select group_id from public.groups where slug = $2)";
					const values = [args.email, args.groupSlug];
					await executeQuery(sql, values);

					return args;
				},
			},
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
