const express = require("express");
const fs = require("fs");

const app = express();

function load() {
  var content = fs.readFileSync('data.csv', 'utf-8');
  var lines = content.trimRight().split('\n');
  var headers = lines[0].split(",");
  var results = []
  for (var i=1; i<lines.length; i++) {
    var curline = lines[i].split(",");
    var obj = {};
    for (var j=0; j<headers.length; j++) {
      obj[headers[j]] = curline[j];
    }
    results.push(obj);
  }
  return results;
};

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get("/data", (req, res) => {
  data = load();
  res.send(JSON.stringify(data));
})

app.listen(8080, () => {
  console.log("The server is up and running!");
});
