'use server';
import { OAuth2Client } from 'google-auth-library';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types/user';
import { COOKIE_NAME } from '@/types/cookie';
import { redirect } from 'next/navigation';

const client = new OAuth2Client();

const getToken = async () => {
    const cookie = await cookies();

    const accessToken = cookie.get(COOKIE_NAME);

    verifyCookies(accessToken?.value);

    return accessToken;
};

const verifyCookies = async (accessToken?: string): Promise<string | null> => {
    try {
        if (!accessToken) {
            return null;
        }

        const ticket = await client.verifyIdToken({
            idToken: accessToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload?.email) {
            return null;
        }

        return payload.email;
    } catch {
        const cookie = await cookies();
        cookie.delete(COOKIE_NAME);

        redirect('/');
    }
};

export const getEmail = async () => {
    const accessToken = await getToken();

    if (!accessToken?.value) {
        return null;
    }

    const decoded = jwtDecode(accessToken?.value) as { name: string };

    return decoded.name;
};

export const getUser = async (): Promise<User | null> => {
    const accessToken = await getToken();

    if (!accessToken?.value) {
        return null;
    }

    const decoded = jwtDecode(accessToken?.value) as {
        email: string;
        name: string;
    };

    return {
        email: decoded.email,
        name: decoded.name,
    };
};

export const hasAccess = async () => {
    const accessToken = await getToken();

    return !!accessToken?.value;
};
