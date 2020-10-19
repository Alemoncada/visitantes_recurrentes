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
    logged: {
      type: Boolean,
      default : false,
    }

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
    return await VisitorModel.find({logged : true},function (err,visitors){
        if(err){ 
        return console.error(err);
      }
      
        return visitors
     });
}

function login({email, password}, callback){
  VisitorModel.findOne({email}).exec(function (err, visitor){
    if(err){ 
      console.error(err);
      return callback(false);
    }

      if (visitor && visitor.password === password){
        visitor.logged = true;
        visitor.save((err) =>{
          if(err){ 
            console.error(err);
            return callback(false);
          }
         return callback(visitor.id) 
        })
        }else{
        return callback(false);
      } 
  });
};

function logout(id, callback){
  VisitorModel.findById(id).exec(function(err, visitor){
    if(err){
      console.error(err);
    }
    if(visitor){
      visitor.logged = false;
      visitor.save((err) => {
        if(err){
          console.error(err);
        }
        callback();
    })
    }
  })
}

module.exports = {
    createvisitor,
    getAllvisitors,
    login,
    logout,
}
