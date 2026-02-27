'use server';
import { auth } from '@/auth';
import type { User } from '@/types/user';

export const getEmail = async () => {
    const session = await auth();

    return session?.user?.email ?? null;
};

export const getUser = async (): Promise<User | null> => {
    const session = await auth();

    if (!session?.user?.email || !session?.user?.name) {
        return null;
    }

    return {
        email: session.user.email,
        name: session.user.name,
    };
};

export const hasAccess = async () => {
    const session = await auth();

    return !!session?.user;
};
