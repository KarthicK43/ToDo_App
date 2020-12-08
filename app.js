const express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    app = express(),
    list = require("./models/todo");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/todoapp",{useUnifiedTopology:true, useFindAndModify:false, useNewUrlParser:true, useCreateIndex:true});

// Home Route
app.get("/",(req,res)=>{
    list.find({}).sort([["priority",1]]).exec(async function(err,dblist){
        dbsorted=await resort(dblist);
        res.render("home",{list:dbsorted,type:"ADD"});
    })
})
// Create Route
app.post("/todo",(req,res)=>{
    var {todo,priority}=req.body;
    list.create({todo,priority},(err,dbtodo)=>{
        if(err){
            console.log(err);
        }
        res.redirect("/");
    })

})
// Delete Route
app.delete("/todo/:id",(req,res)=>{
    list.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        {console.log(err);}
    })
    res.redirect("/");
})
// Edit page route
app.get("/todo/:id",(req,res)=>{
    list.find({}).sort([["priority",1]]).exec(async function(err,dblist){
        dbsorted=await resort(dblist);
       await list.findById(req.params.id,(err,to)=>{
            res.render("home",{list:dbsorted,type:"UPDATE",to:to});

        })
    })
})
// Edit route
app.put("/todo/:id",(req,res)=>{
    var{todo,priority}=req.body;
    list.findByIdAndUpdate(req.params.id,req.body.list,(err,dbtodo)=>{
        res.redirect("/");
    })
})
app.listen(3000,()=>{
    console.log("Server Started");
})

function resort(dos){
    var l=dos.findIndex(x=>x.priority=="Low");
    var low=dos.splice(l,(dos.findIndex(x=>x.priority=="Medium")-l))
    dos.push.apply(dos,low);
    return dos;
}