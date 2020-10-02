const mongoose = require("mongoose");
const { stringify } = require("qs");

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
   
    name : String,
    email : String,
    password : String,   
  });

const VisitorModel = mongoose.model("Visitor", VisitorSchema);

async function createvisitor(user, callback){    
  VisitorModel.create(user, function(err){
    if(err){
      return console.error(err);
    }
    callback()
  });
}
      


async function getAllvisitors(){
    return await VisitorModel.find({},function (err,visitors){
        if(err){ 
        return console.error(err);
      }
      
        return visitors
     });
}

module.exports = {
    createvisitor,
    getAllvisitors,
}