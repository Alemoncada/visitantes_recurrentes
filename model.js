const mongoose = require("mongoose");

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
    name:{  
    type: String,
    default: "Anónimo"
    }
  });

const VisitorModel = mongoose.model("Visitor", VisitorSchema);

async function createvisitor(name, callback){
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
         name,
       });
    }
       const visitors = await getAllvisitors();

       callback(visitors);
        }
        );
      }else{
       await VisitorModel.create({});
       const visitors = await getAllvisitors();

       callback(visitors);
      }
      
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