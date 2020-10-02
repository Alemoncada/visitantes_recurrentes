const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyparser = require("body-parser");
const model = require("./model");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.engine("html", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + "/views");


app.get("/", async (req, res) => {
  const visitors = await model.getAllvisitors(); 
  res.render("table.html", {visitors})
 
});

app.get("/register",(req, res)=>{
  res.render("register.html",{})
})

app.post("/register", (req, res)=>{
const {name, email, password} = req.body;
const user = {name, email, password}
model.createvisitor(user, () => {
  res.redirect("/")
})
})


app.listen(3000, () => {
  console.log("server listening on port 3000");
});