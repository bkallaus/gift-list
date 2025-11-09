"use server";
import { redirect } from "next/navigation";
import { executeQuery } from "./database";
import { v4 } from "uuid";
import { getUser } from "./verify-credentials";
import { User } from "@/types/user";

const checkIfUserExistsOrInsert = async (user: User) => {
	const query = "select * from users where email = $1;";
	const variables = [user.email];

	const result = await executeQuery(query, variables);

	if (!result.length) {
		const slug = v4();
		const insertQuery =
			"insert into users (email, slug, first_name, last_name) values ($1, $2, $3, $4);";
		const insertVariables = [
			user.email,
			slug,
			user.name,
		];

		await executeQuery(insertQuery, insertVariables);
	}
};

export const getUserProfileData = async (): Promise<User> => {
	const user = await getUser();

	if(!user){
		redirect('/');
	}

	await checkIfUserExistsOrInsert(user);

	return user;
};
