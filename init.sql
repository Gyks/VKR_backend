CREATE TABLE user_visitor(
	uid serial PRIMARY KEY,
	headers text,
	date_joined timestamp,
	last_seen timestamp,
	site_id int
);

CREATE TABLE site(
	id serial PRIMARY KEY,
	domain_name text UNIQUE,
	started_monitoring timestamp
);

CREATE TABLE click(
	id serial PRIMARY KEY,
	clicked_time timestamp,
	_path text,
	visitor_id int,
	element_uid text,
	element_html text
);