var express = require("express");

const needle = require("needle");

//create a server object:
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//start server and listen for the request

// const port = 4000;

// app.listen(port, () =>
//   //a callback that will be called as soon as server start listening
//   console.log(`server is listening at http://localhost:${port}`)
// );

app.get("/", (req, res, next) => {
  res.send("Hi from the Node Server");
});

app.get("/api/", (req, res, next) => {
  res.send("Server is up and ready for api requests");
});

const token = process.env.BEARER_TOKEN;

app.get("/api/:name", (request, response, next) => {
  const newEndpointURL = "https://api.twitter.com/2/tweets/search/recent";

  let ticker = request.params.name;

  const params = {
    query:
      ticker +
      " from:Trade_The_News -is:reply OR " +
      ticker +
      " from:OpenOutcrier -is:reply",
    "tweet.fields": "author_id",
    "user.fields": "name"
  };

  console.log(request.params.name);

  needle(
    "get",

    newEndpointURL,
    params,
    {
      headers: { authorization: `Bearer ${token}` }
    }
  )
    .then((res) => {
      console.log(res.body);
      response.json(res.body);
    })

    .catch((err) => response.json({ success: false, result: err }));
});

module.exports = app;
