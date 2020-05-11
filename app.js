const express = require("express");
const cors = require("cors");
const db = require("./db/db");
const config = require("dotenv").config().parsed;
const app = express();
const bodyParser = require("body-parser");
const { Client } = require("pg");
const port = 3333;

const whitelist = ["http://localhost:3333"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

client = new Client({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
  port: 5432,
});

client.connect();
app.locals.client = client;
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send(`main`);
});

app.get("/site/all", async (req, res) => {
  const rs = await db.fetchSites(req.app.locals.client);
  let message = "Currently monitoring those sites: \n";
  for (item of rs) {
    message += `<br>id:${item.id} — domain:${item.domain_name} — since:${item.started_monitoring}`;
  }
  res.send(message);
});

app.post("/site/add", async (req, res) => {
  if ("domain" in req.body && typeof req.body.domain == "string") {
    const rs = await db.addSite(req.app.locals.client, req.body.domain);
    res.send(req.body.domain + " succesfully added to db");
  } else {
    res.send("Error has occured, check your json structure");
  }
});

app.post("/user/add", async (req, res) => {
  if ("domain" in req.body && typeof req.body.domain == "string") {
    const rs = await db.addUser(req.app.locals.client, req.body.domain);
    res.send(rs);
  } else {
    res.send("Error has occured, check your json structure");
  }
});

app.get("/user/get", async (req, res) => {
  if ("id" in req.query) {
    const rs = await db.fetchUser(req.app.locals.client, req.query.id);
    res.send(rs);
  } else {
    res.send("Error has occured, check your json structure");
  }
});

app.post("/click/add", async (req, res) => {
  // TODO проверки
  const rs = await db.addClick(
    req.app.locals.client,
    req.body.visitorId,
    req.body.href,
    req.body.elementId,
    req.body.elementHtml
  );
  res.send(rs);
});

app.listen(port, () => console.log(`Currently running on ${port}...`));
