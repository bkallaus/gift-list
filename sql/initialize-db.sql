
CREATE FUNCTION update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
CREATE TRIGGER users_updated_at_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
CREATE TRIGGER groups_updated_at_modtime BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


CREATE TABLE user_groups (
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  group_id INTEGER NOT NULL REFERENCES groups(group_id),
  PRIMARY KEY (user_id, group_id)
);


CREATE TABLE user_gifts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  title VARCHAR(255) NOT NULL,
  url VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TRIGGER user_gifts_updated_at_modtime BEFORE UPDATE ON user_gifts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
