let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path= require("path");
let xlsx=require("xlsx");

request(
    "https://www.espncricinfo.com/scores/series/8048/season/2020/indian-premier-league?view=results", getAMurl);

function getAMurl(err, resp, html) {
    let sTool = cheerio.load(html);
    let allmatchUrlElem = sTool("a[data-hover='Scorecard']");
    for (let i = 0; i < allmatchUrlElem.length; i++) {
        let href = sTool(allmatchUrlElem[i]).attr("href");
        let fUrl = "https://www.espncricinfo.com" + href;
        findDataofAMatch(fUrl);
        // console.log(fUrl)
    }
}

function findDataofAMatch(url) {
    request(url, whenDataArrive)
}

function whenDataArrive(err, resp, html) {
    let sTool= cheerio.load(html);
    let tableElem=sTool("div.card.content-block.match-scorecard-table .Collapsible");
    console.log(tableElem.length);
  
    let count=0;
    for(let i=0;i<tableElem.length;i++){
      
        let rowsOfATeam=sTool(tableElem[i]).find(".table.batsman").find("tbody tr");
        let teamName= sTool(tableElem[i]).find("h5.header-title.label").text();
   
       let teamStrArr= teamName.split("Innings");
       teamName=teamStrArr[0].trim();
        console.log(teamName);
    for(let j=0;j<rowsOfATeam.length;j++){
       let  rCols=sTool(rowsOfATeam[j]).find("td"); 
       let isBatsManRow= sTool(rCols[0]).hasClass("batsman-cell");
        if(isBatsManRow==true){
        count++;
        let pName= sTool(rCols[0]).text().trim();
        let runs= sTool(rCols[2]).text().trim();
        let balls= sTool(rCols[3]).text().trim();
        let fours= sTool(rCols[5]).text().trim();
        let sixes= sTool(rCols[6]).text().trim();
        let sr= sTool(rCols[7]).text().trim();
        
        // console.log(`Name:${pName} Runs: ${runs} Balls: ${balls} Fours: ${fours} Sixes: ${sixes} Sr:${sr}`);
        processPlayer(teamName,pName,runs,balls,fours,sixes,sr);
        }
    }
    // console.log("No of batsman of in a team",count);
    count=0;

    }
}
function processPlayer(team,name,runs,balls,fours,sixes,sr){
  
    let dirPath=team;
    let  pMatchStats={
        Team:team,
        Name:name,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        Sr:sr,
        Runs:runs
    }
    if (fs.existsSync(dirPath)) {
   
    }else{
        fs.mkdirSync(dirPath);
    }
    let playerFilePath= path.join(dirPath,name+".xlsx");
    let pData=[];
    if(fs.existsSync(playerFilePath)){
     pData=excelReader(playerFilePath,name)
     pData.push(pMatchStats);
    }else{
    console.log("File of player",playerFilePath,"created");
    pData=[pMatchStats];
    }
    excelWriter(playerFilePath,pData,name);
    }
    
    function excelReader(filePath, name) {
        if (!fs.existsSync(filePath)) {
            return null;
        } else{
    
    let wt = xlsx.readFile(filePath);
    let excelData = wt.Sheets[name];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
        }
    }
    function excelWriter(filePath, json, name) {
        // console.log(xlsx.readFile(filePath));
        let newWB = xlsx.utils.book_new();
        // console.log(json);
        let newWS = xlsx.utils.json_to_sheet(json);
        xlsx.utils.book_append_sheet(newWB, newWS, name);  
    
        xlsx.writeFile(newWB, filePath);
    }
    