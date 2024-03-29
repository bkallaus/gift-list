import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLFloat,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLBoolean,
} from "graphql";
import { executeQuery, getPool } from "@/services/database";
import { v4 } from "uuid";
import { chooseNames } from "@/services/choose-names";

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
		purchased: {
			type: GraphQLBoolean,
			resolve(src) {
				return !!src.purchased_by;
			},
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
		isAdmin: {
			type: GraphQLBoolean,
			async resolve(src, _, ctx) {
				const sql = `SELECT * FROM public.groups g
				join public.users u on g.admin = u.user_id 
				where u.email = $1 and g.group_id = $2`;

				const values = [ctx.user.email, src.group_id];

				const result = await executeQuery(sql, values);

				return result.length ? true : false;
			},
		},
		giftReceipient: {
			type: User,
			async resolve(src, _, ctx) {
				const sql =
					"select gift_recipient_id from public.user_groups where user_id = (select user_id from public.users where email = $1) and group_id = $2";
				const values = [ctx.user.email, src.group_id];
				const result = await executeQuery(sql, values);

				if (!result[0]) {
					return null;
				}

				const recipient = await executeQuery(
					"SELECT * FROM public.users where user_id = $1",
					[result[0].gift_recipient_id],
				);

				return recipient[0];
			},
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

const hasAccessToGroup = async ({
	groupSlug,
	email,
}: {
	groupSlug: string;
	email: string;
}) => {
	const sql = `SELECT g.*
		FROM public.groups g 
		join public.user_groups ug on g.group_id = ug.group_id 
		join public.users u on ug.user_id = u.user_id 
		where u.email = $1 and g.slug = $2`;

	const values = [email, groupSlug];

	const result = await executeQuery(sql, values);

	return result.length ? result[0] : null;
};

export const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQueryType",
		fields: {
			user: {
				type: User,
				args: {
					slug: {
						type: GraphQLString,
					},
				},
				async resolve(src, args) {
					const result = await executeQuery(
						"SELECT * FROM public.users where slug = $1",
						[args.slug],
					);

					return result[0];
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
						where u.email = $1 and g.is_active = true`,
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
					const sql = `SELECT g.* 
					FROM public.groups g 
					join public.user_groups ug on g.group_id = ug.group_id 
					join public.users u on ug.user_id = u.user_id 
					where u.email = $1 and g.slug = $2`;

					const values = [ctx.user.email, args.groupSlug];
					const result = await executeQuery(sql, values);

					return result ? result[0] : null;
				},
			},
			gifts: {
				type: new GraphQLList(Gift),
				args: {
					userSlug: {
						type: GraphQLString,
					},
					groupSlug: {
						type: GraphQLString,
					},
				},
				async resolve(src, args, ctx) {
					if (args.userSlug && args.groupSlug) {
						const hasAccess = await hasAccessToGroup({
							groupSlug: args.groupSlug,
							email: ctx.user.email,
						});

						if (!hasAccess) {
							return null;
						}

						//convert to has access to group
						return executeQuery(
							`SELECT ug.* 
							FROM public.user_gifts ug 
							JOIN public.users u on ug.user_id = u.user_id
							JOIN public.user_groups ug2 on ug2.user_id = u.user_id
							JOIN public.groups g on g.group_id = ug2.group_id
							where g.slug = $1 and u.slug = $2`,
							[args.groupSlug, args.userSlug],
						);
					}

					return executeQuery(
						"SELECT * FROM public.user_gifts ug join public.users u on ug.user_id = u.user_id where u.email = $1 order by ug.id asc",
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
			assignNames: {
				type: Group,
				args: {
					groupSlug: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				async resolve(_, args, ctx) {
					const hasAccess = await hasAccessToGroup({
						groupSlug: args.groupSlug,
						email: ctx.user.email,
					});

					if (!hasAccess) {
						return null;
					}

					const slugs = await executeQuery(
						`SELECT u.slug FROM public.groups g 
						join public.user_groups ug on g.group_id = ug.group_id
						join public.users u on ug.user_id = u.user_id
						where g.slug = $1`,
						[args.groupSlug],
					);

					const pairs = chooseNames(slugs.map((s) => s.slug));

					const sql = `UPDATE public.user_groups
					SET gift_recipient_id = (select user_id from public.users where slug = $1)
					WHERE user_id = (select user_id from public.users where slug = $2)
					AND group_id = $3 returning *`;

					const response = await Promise.all(
						pairs.map(async (pair) => {
							return await executeQuery(sql, [
								pair.reciever,
								pair.giver,
								hasAccess.group_id,
							]);
						}),
					);

					return executeQuery("SELECT * FROM public.groups where slug = $1", [
						args.groupSlug,
					]);
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
			editGroup: {
				type: Group,
				args: {
					groupSlug: {
						type: new GraphQLNonNull(GraphQLString),
					},
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
					//consider checking on email
					const sql =
						"UPDATE public.groups SET name = $1, description = $2, gift_limit = $3 WHERE slug = $4 returning *";
					const values = [
						args.name,
						args.description,
						args.limit,
						args.groupSlug,
					];
					const result = await executeQuery(sql, values);

					return result ? result[0] : null;
				},
			},
			removeGroup: {
				type: Group,
				args: {
					groupSlug: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				async resolve(_, args, ctx) {
					const hasAccess = hasAccessToGroup({
						groupSlug: args.groupSlug,
						email: ctx.user.email,
					});

					if (!hasAccess) {
						return null;
					}

					const sql =
						"update public.groups set is_active=false WHERE slug = $1 returning *";
					const values = [args.groupSlug];
					const result = await executeQuery(sql, values);

					return result ? result[0] : null;
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
			purchaseGift: {
				type: Gift,
				args: {
					giftId: {
						type: GraphQLInt,
					},
					purchased: {
						type: GraphQLBoolean,
					},
				},
				async resolve(_, args, ctx) {
					if (args.purchased) {
						const sql =
							"UPDATE public.user_gifts SET purchased_by = (select user_id from public.users where email = $1) WHERE id = $2 returning *";
						const values = [ctx.user.email, args.giftId];

						const result = await executeQuery(sql, values);

						return result ? result[0] : null;
					}

					const sql =
						"UPDATE public.user_gifts SET purchased_by = null WHERE id = $1 returning *";
					const values = [args.giftId];
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
