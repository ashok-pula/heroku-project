const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js")
const mongoose=require("mongoose");
const _=require("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//  const items=["Buy food","Cook food","Eat food"];
// const workItems=[];
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",function(err){
mongoose.connect("mongodb+srv://admin-ashok:12345@cluster0.4oa7fuq.mongodb.net/todolistDB",function(err){

  if(err) console.log("not connected");
  else console.log("connected mongoDB");
});
const todolistSchema=new mongoose.Schema({
  name:String
});
const Item=mongoose.model("Item",todolistSchema);
const item1=new Item({
  name:"Buy food"
});
const item2=new Item({
  name:"Cook food"
});
const item3=new Item({
  name:"Eat food"
});
const listSchema={
  name:String,
  items:[todolistSchema]
}
const List=mongoose.model("list",listSchema);
const defaultItems=[item1,item2,item3];
app.get("/", function(req, res) {


  Item.find(function(err,foundItems){
    if(err) console.log("not data found");
    else if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err) console.log("not inserted");
        else console.log("inserted successfully");
      })
      res.redirect("/");

    }
    else{
      res.render("list", {
        listTitle: "To Day",
        newItemLists:foundItems
      });
    }
  })


})
app.get("/:topic",function(req,res){
  const customListName=_.capitalize(req.params.topic);
  List.findOne({name:customListName},function(err,foundList){
    if(err){
      console.log("error found")
    }
    else{
      if(!foundList){
        //create new List
        const list=new List({
          name:customListName,
          items:defaultItems
        })
        list.save();
        // console.log("ashok")
        // console.log("/"+listName)
        res.redirect("/"+customListName);

      }else{
        //show existing list
        res.render("list",{listTitle:customListName,newItemLists:foundList.items});
      }
    }
  })

  // console.log(req.params.topic)
})

app.post("/",function(req,res){
const itemName=req.body.newItem;
const listName=req.body.list;
const item=new Item({
  name:itemName
})
if(listName == "To"){
// console.log("ashok");
item.save();
res.redirect("/");
}
else{
  // console.log("shia");
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();

    res.redirect("/"+listName);
  })
}




})

app.post("/delete",function(req,res){
  const checkedItem=req.body.checkbox;
  const listName=req.body.listName;
  console.log(checkedItem);
  if(listName=="To"){
    Item.findByIdAndRemove(checkedItem,function(err){
      if(err) console.log("not deleted");
      else {console.log("deleted successfully")
    res.redirect("/")}
    })
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    })
  }

})

// app.get("/work",function(req,res){
//   res.render("list",{listTitle:"Work List",newItemLists:workItems})
// })
app.post("/work",function(req,res){
  let item =req.body.newItem;
  workItems.push(item);
  res.redirect("/");
})
app.listen("3000", function() {
  console.log("server runnning at 3000");
})
// switch (currentDate) {
//   case 0:
//     day = "Sunday";
//     break;
//   case 1:
//     day = "Monday";
//     break;
//   case 2:
//     day = "Tuesday";
//     break;
//   case 3:
//     day = "wednusday";
//     break;
//   case 4:
//     day = "Thursday";
//     break;
//   case 4:
//     day = "friday";
//     break;
//   case 6:
//     day = "saturday";
//     break;
//   default:console.log("Error");
//
// }
