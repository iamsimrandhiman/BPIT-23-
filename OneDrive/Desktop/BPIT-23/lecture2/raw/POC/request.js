let request=require("request");
let fs=require("fs");
let ch=require("cheerio");
request('https://www.espncricinfo.com/series/8048/scorecard/1237181/delhi-capitals-vs-mumbai-indians-final-indian-premier-league-2020-21',urlkaAns);
function urlkaAns(err,response,html){
    console.log(err);
  //  fs.writeFileSync("index.html",html);
console.log("Received file");
let STool=ch.load(html);
//let output=STool("div.summary");
//console.log(output.html());
//console.log(output.text());
let inningsArr=STool("div.card.content-block.match-scorecard-table");
let fullHtml="<table>"
for(let i=0;i<2;i++){
  let tableBatsMan=
  STool(inningsArr[i]).find("table.table.batsman");
  fullHtml+=STool(tableBatsMan).html();
  fullHtml+="<table>";
}
fs.writeFileSync("innings.html",fullHtml);
}