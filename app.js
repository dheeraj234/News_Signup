const express = require("express");
const bodyParser= require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",(req,res)=>{
  res.sendFile(__dirname +"/signup.html");
})
app.post("/",(req,res)=>{
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const url="https://us5.api.mailchimp.com/3.0/lists/21f80d6023";
  const options=
  {
    method:"POST",
    auth: "dheeraj:"+process.env.API_KEY
  }
  const request = https.request(url,options,(response)=>{
    if(response.statusCode===200)
    res.sendFile(__dirname+"/success.html");
    else {
      res.sendFile(__dirname +"/failure.html");
    }

    response.on("data",(data)=>{
      console.log(JSON.parse(data))
    });
  });
  request.write(jsonData);
  request.end();
});
app.post("/failure", (req,res)=>{
  res.redirect("/");
});
app.listen(process.env.PORT||3000,()=>{
  console.log("server running port 3000");
});
