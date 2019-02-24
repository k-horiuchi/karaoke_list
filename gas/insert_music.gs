function doPost(e) {
	var sheet = SpreadsheetApp.openById("1o9MH8bnm74mvqXltu0RjVw3hEnjkpHH_6YkyEGVJOoA").getSheetByName("Sheet1");
	// データ取得
	var request = e.parameter.request;
	var music_title = e.parameter.music_title;
	var artist = e.parameter.artist;
	var file = "thanks";
	// 必須チェック
	if (request == "" || music_title == "" || artist == "") {
		file = "error";
		return htmlCall(file);
	} else {
		var last_row = sheet.getLastRow();
		var insertStr = music_title + artist;
		// 曲名・歌手名の重複チェック
		for (var i = 1; i <= last_row; i++) {
			var chkStr = sheet.getRange(i, 2).getValue() + sheet.getRange(i, 3).getValue();
			if (insertStr === chkStr) {
				file = "validator";
				return htmlCall(file);
			}
		}
	}
	// データをシートに追加
	var genre = e.parameter.genre;
	var related = e.parameter.related;
	var dt = new Date();
	var y = dt.getFullYear();
	var m = ("00" + (dt.getMonth() + 1)).slice(-2);
	var d = ("00" + dt.getDate()).slice(-2);
	var upd_date = y + m + d;
	sheet.appendRow([last_row, music_title, artist, genre, related, "", request, 0, upd_date]);
	return htmlCall(file);
}
// htmlファイルを表示
function htmlCall(file) {
	var htmlOutput = HtmlService.createTemplateFromFile(file).evaluate();
	htmlOutput.setTitle('file').addMetaTag('viewport', 'width=device-width, initial-scale=1')
	return htmlOutput;
}