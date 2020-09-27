const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", function (err) {
  if (err) {
    return console.error(err);
  }
});

const VisitorSchema = mongoose.Schema({
  count:{
    type: Number,
    default: 1,
  },
  name: String,
});

const VisitorModel = mongoose.model("Visitor", VisitorSchema);

app.get("/", async (req, res) => {
  const { name } = req.query;
  
  if(name){
   await VisitorModel.findOne({
    name
  }, async function(err, visitor){
    if (err){
      console.error(err);
    }
    if (visitor){
      visitor.count = visitor.count + 1;
     await visitor.save();
    }else{

  await VisitorModel.create({
     name
  });

    }
  })
 }else{
  await VisitorModel.create({
    name: "Anónimo",
 });
 }

  VisitorModel.find({},function (err,visitors){
  if(err){ 
  return console.error(err);
}

  let template = `<table><tr><th>Id</th><th>Name</th><th>Visits</th></tr>`;

  visitors.forEach(visitor => {
    template += `<tr>
    <td>${visitor.id}</td>
    <td>${visitor.name}</td>
    <td>${visitor.count}</td></tr>`
  });
 
  template += `</table>`;
  res.send(template);
 });
 
});


app.listen(3000, () => {
  console.log("server listening on port 3000");
});