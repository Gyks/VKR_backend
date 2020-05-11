async function addSite(client, domain_name) {
  const date = new Date();
  query = {
    name: "add-site",
    text:
      "INSERT INTO site(domain_name, started_monitoring) VALUES($1, $2) RETURNING *",
    values: [domain_name, date],
  };
  const result = await client.query(query);
  console.log(result);
  return result;
}

async function fetchSites(client) {
  query = {
    name: "fetch-sites",
    text: "SELECT * FROM site",
  };
  const result = await client.query(query);
  return result.rows;
}

async function fetchSiteId(client, domain_name) {
  query = {
    name: "fetch-site-id",
    text: "select id from site where (domain_name = $1);",
    values: [domain_name],
  };
  const result = await client.query(query);
  return result.rows;
}

async function addUser(client, domain_name) {
  let siteId = await fetchSiteId(client, domain_name);
  siteId = siteId[0].id;
  const date = new Date();

  query = {
    name: "add-user",
    text:
      "INSERT INTO user_visitor(date_joined, last_seen, site_id) VALUES($1, $2, $3) RETURNING *",
    values: [date, date, siteId],
  };
  const result = await client.query(query);
  console.log(result);
  return result;
}

async function fetchUser(client, id) {
  query = {
    name: "fetch-user",
    text: "SELECT * FROM user_visitor WHERE uid = $1",
    values: [id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

async function addClick(client, visitor_id, _path, element_uid, element_html) {
  const date = new Date();

  query = {
    name: "add-click",
    text:
      "INSERT INTO click(clicked_time, _path, visitor_id, element_uid, element_html) VALUES($1, $2, $3, $4, $5) RETURNING *",
    values: [date, _path, visitor_id, element_uid, element_html],
  };
  const result = await client.query(query);
  console.log(result);
  return result;
}

module.exports = {
  addSite: addSite,
  fetchSites: fetchSites,
  addUser: addUser,
  fetchUser: fetchUser,
  addClick: addClick,
};
