const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');

app.use(bodyParser.json())

app.get('/',(req,res)=>{
    readDataFromJson()
    res.send('halo')
})

app.post('/', function(req, res) {
    // Insert JSON straight into MongoDB
   db.collection('employees').insert(req.body, function (err, result) {
       if (err)
          res.send('Error');
       else
         res.send('Success');
 
   });
 });

function readDataFromJson(){
    const data = fs.readFileSync("./Mall_Metropolitan.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        
      });
    

}
module.exports = app