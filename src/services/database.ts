import { Pool } from "pg";

let pool: Pool;

export const getPool = () => {
	if (pool) return pool;

	pool = new Pool({
		connectionString: process.env.POSTGRES_URL,
		ssl: {
			rejectUnauthorized: false,
		},
		database: "postgres",
	});

	return pool;
};

export const executeQuery = async (
	query: string,
	variables: (string | number)[] = [],
) => {
	const pool = getPool();

	const result = await getPool().query(query, variables);

	if (!result.rows) return [];

	return result.rows;
};
