var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

require("dotenv").config({ path: __dirname + "/../.env" });

const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const url = `${process.env.HASURA_GRAPHQL_URL}`;

const options = {
  method: "Get",
  headers: {
    "Content-Type": "application/json",
    "X-Hasura-Admin-Secret": HASURA_GRAPHQL_ADMIN_SECRET,
  },
};

/* GET home page. */
router.get("/", async (req, res, next) => {
  const fetchAPI = await fetch(url, options);
  const fetchAPIResponse = await fetchAPI.json();
  let driveSpaceData = fetchAPIResponse.server_space_latest_data;

  driveSpaceData = driveSpaceData
    .filter(
      (item) =>
        item.server_name !== "Hestia" &&
        item.server_name !== "Urania" &&
        item.server_name !== "kbo" &&
        item.server_name !== "stgm-web" &&
        item.server_name !== "Themis" &&
        item.server_name !== "Mattermost"
    )
    .sort((a, b) => {
      return (
        a.server_name.localeCompare(b.server_name) ||
        a.server_location.localeCompare(b.server_location)
      );
    });

  res.render("index", { title: "Drive Space", driveSpaceData });
});

module.exports = router;
