 let req = require("request");
// req("http://www.google.com",requestkAns);
// function requestkAns(err,res,html){
    
//     console.log(err);
//     console.log(res.statuscode);
//     console.log(html);
//     if(err){
//         console.log("some error",err);
//     }else{
//         console.log(html);
//     }
// } 
let fs=require("fs");
req("https://www.espncricinfo.com/series/8048/game/1237181/delhi-capitals-vs-mumbai-indians-final-indian-premier-league",requestkAns);

function requestkAns(err,res,html){
   node request.js
    if(err){
        console.log("some error",err);
    }else{
       console.log(html);
       console.log("Recieved input");
       fs.writeFileSync("index.html",html);
    }

}