"use server";
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { notFound, redirect } from "next/navigation";
import { executeQuery } from "./database";

const checkIfUserExists = async (email: string) => {
	const query = "select * from users where email = $1;";
	const variables = [email];

	const result = await executeQuery(query, variables);

	return result[0];
};

export const getUserProfileData = async (): Promise<Claims> => {
	const session = await getSession();

	if (!session) {
		redirect("/");
	}

	const userExists = await checkIfUserExists(session.user.email);
	if (!userExists) {
		notFound();
	}

	const { user } = session;

	return user;
};
