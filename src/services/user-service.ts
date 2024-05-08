"use server";
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export const getUserProfileData = async (): Promise<Claims> => {
	const session = await getSession();

	if (!session) {
		console.log("test");
		redirect("/");
	}

	const { user } = session;

	return user;
};
