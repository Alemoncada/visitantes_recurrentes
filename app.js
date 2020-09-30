const express = require("express");
const mustacheExpress = require("mustache-express")
const model = require("./model")

const app = express();
app.engine("html", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + "/views");


app.get("/", (req, res) => {
  const { name } = req.query;
  
  model.createvisitor(name,(visitors) => {
  res.render("table.html", {visitors})
 });

});


app.listen(3000, () => {
  console.log("server listening on port 3000");
});