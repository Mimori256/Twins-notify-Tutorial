//変数を編集してください。
var sheet = SpreadsheetApp.openByUrl("自分の空のスプレッドシートのURLを入力してください");
var address = "自分のメールアドレスを入力してください"

var url = "https://twins.tsukuba.ac.jp/campusweb/campusportal.do";


function get_value(cell) {
  return sheet.getRange(cell).getValue();
}


function set_value(cell, value) {
  sheet.getRange(cell).setValue(value)
}


function send_mail(title) {

  var body = title + "\n\n" + "Twins: " + url;
  MailApp.sendEmail(address,"Twins updated",body);
  
}


function update() {

  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText("UTF-8");
  
  var previous_title = get_value("A1");

  if (previous_title == "") {
     set_value("A1", get_title(content));
     return 0;
  }

  var title = get_title(content)
  Logger.log(title)
  
  if (previous_title != title) {
     set_value("A1", title);
     send_mail(title);
   }

   else {
     Logger.log("No change")
     return 0;
   }
   
 }
 

function get_title(content) {

  var data = Parser.data(content).from('<a href="JavaScript:void(0);').to('</a>').build();
  listed_data = data.split("")

  var index = 0

  for (let i=0; i<listed_data.length; i++) {
    if (listed_data[i] == ">") {
      index = i+1;
    }
  }
  var title = "";
  for (let i=index; i<listed_data.length; i++ ) {
    title = title + listed_data[i];
  }

  return title.trim().replace("\n", "")
  
}
