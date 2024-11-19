"use server";
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { executeQuery } from "./database";
import { v4 } from "uuid";

const checkIfUserExistsOrInsert = async (user: Claims) => {
	const query = "select * from users where email = $1;";
	const variables = [user.email];

	const result = await executeQuery(query, variables);

	if (!result.length) {
		const slug = v4();
		const insertQuery =
			"insert into users (email, slug, first_name, last_name) values ($1, $2, $3);";
		const insertVariables = [
			user.email,
			slug,
			user.given_name,
			user.family_name,
		];

		await executeQuery(insertQuery, insertVariables);
	}
};

export const getUserProfileData = async (): Promise<Claims> => {
	const session = await getSession();

	if (!session) {
		redirect("/");
	}

	await checkIfUserExistsOrInsert(session.user);

	const { user } = session;

	return user;
};
