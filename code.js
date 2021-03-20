//変数を編集してください。
var sheet = SpreadsheetApp.openByUrl("自分の空のスプレッドシートのURLを入力してください");
var address = "自分のメールアドレスを入力してください";

var url = "https://twins.tsukuba.ac.jp/campusweb/campusportal.do";


function get_value(cell) {
  return sheet.getRange(cell).getValue();
}


function set_value(cell, value) {
  sheet.getRange(cell).setValue(value);
}


//更新があった場合、メールを送信
function send_mail(title) {

  var body = title + "\n\n" + "Twins: " + url;
  MailApp.sendEmail(address,"Twins updated",body);
  
}


function update() {

  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText("UTF-8");
  
  var previous_title = get_value("A1");

  
  //初回実行の場合、スクレイピングだけをして終了する
  if (previous_title == "") {
     set_value("A1", get_title(content));
     return 0;
  }

  var tmp = get_title(content);
  var title_1 = tmp[0];
  var title_2 = tmp[1];
  
  if (previous_title == title_2) {
     set_value("A1", title_1);
     send_mail(title_1);
   }

   else if (previous_title != title_2 && previous_title != title_1) {
     set_value("A1", title_1);
     let title = title_1 + "\n\n" + title_2;
     return 0;
   }
   
 }
 

function form_text(listed_data) {

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

  return title.trim().replace("\n", "");

}


function get_title(content) {

  var data = Parser.data(content).from('<a href="JavaScript:void(0);').to('</a>').iterate();

  //先頭二つの記事のタイトルを取得する
  var listed_data_1 = data[0].split("");
  var listed_data_2 = data[1].split("");

  var title_1 = form_text(listed_data_1);
  var title_2 = form_text(listed_data_2);

  return [title_1, title_2];
  
}
