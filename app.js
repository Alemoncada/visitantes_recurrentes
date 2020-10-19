const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyparser = require("body-parser");
const cookieSession = require('cookie-session');
const model = require("./model");

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieSession({
  secret: 'TEST',
  maxAge: 60 * 60* 24 * 1000,
}));

app.engine("html", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + "/views");


app.get("/", async (req, res) => {
  const { userId } = req.session;

  if(!userId){
res.redirect('/login');
  }else{
    const visitors = await model.getAllvisitors(); 
    res.render("table.html", {visitors, userId})
  } 
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
});

app.get('/login', (req,res) =>{
res.render('login.html', {});
});

app.post('/login', async (req,res) =>{
const {email, password} = req.body;

 model.login({email, password}, (logged)=>{
   
  if (logged){
    req.session.userId = logged;
    res.redirect("/");
  }else{
   res.render('login.html', {error : 'user not found'});
  }
 });
 });

app.get('/logout', (req, res) =>{
  model.logout(req.session.userId, ()=>{
   req.session.userId = null;
  res.redirect('/')
  }); 
  });
  


app.listen(3000, () => {
  console.log("server listening on port 3000");
});