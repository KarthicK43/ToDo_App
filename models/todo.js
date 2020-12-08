const mongoose = require("mongoose");
const listSchema = mongoose.Schema({
    todo :{ type : String},
    priority :{type :String}

})
module.exports=mongoose.model("list",listSchema);