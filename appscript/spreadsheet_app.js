var sheet=SpreadsheetApp.openById("1SqhxFIGp8pMs4EVfZFB3YQmWI22AVH6Qk1o3BCCfZOk").getSheetByName("JOKES");

function getGmail() {
    const query = "from:jiri.stepan@etnetera.cz AND subject:JST_HUMOR";

    let threads = GmailApp.search(query);

    //let label = GmailApp.getUserLabelByName("done");
    //if (!label) {label = GmailApp.createLabel("done")}

    let messages = [];

    threads.forEach(thread => {
        let message=thread.getMessages()[0];
        let body = message.getPlainBody();
        let date = message.getDate();
        messages.push({text:body, date:date});
    });

    return messages;
}

function parseNewLines(text){
  text=text.replace(/\r\n/gm,"\n")
  let lines = text.split("\n")
  let newText = ""
  for (let i=0;i<lines.length-1;i++){
    if (lines[i].length >= 60 ){
      newText =  newText + lines[i] + " "
    } else {
      newText = newText + lines[i] + "\n"
    }
  }
  newText = newText + lines[lines.length-1]

  return newText.trim()
}

function processMessages(){
  let messages = getGmail()
  let data=[];
  sheet.clear()
  for (var i=0;i<messages.length;i++){
     let jokes=messages[i]
     let text=jokes.text
     let month=(""+jokes.date.getMonth()).padStart(2,"0");
     let day=(""+jokes.date.getDate()).padStart(2,"0");
     let date=jokes.date.getFullYear()+"-"+month+'-'+day;
     text=text
          .replace("\"","\\\"")
          .replace(/([-]{4,})/gm , "NEWJOKE")
          .replace(/\nJirka/gm,"")
          .replace("\\\\","")

     let jokelist=text.split("NEWJOKE")

    for (let j=1; j < jokelist.length; j++){
        let text=parseNewLines(jokelist[j].trim());
        data.push([text,date, JSON.stringify({text:text, date:date})+","])
    }
    
  }

  sheet.getRange(1,1,data.length,3).setValues(data)

}


