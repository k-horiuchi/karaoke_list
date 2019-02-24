function getData(id, sheetName) {
	// スプレッドシートを指定
	var sheet = SpreadsheetApp.openById("1o9MH8bnm74mvqXltu0RjVw3hEnjkpHH_6YkyEGVJOoA").getSheetByName("Sheet1");
	var rows = sheet.getDataRange().getValues();
	var keys = rows.splice(0, 1)[0];
	// スプレッドシートのデータ取得
	return rows.map(function (row) {
		var obj = {}
		row.map(function (item, index) {
			obj[keys[index]] = item;
		});
		return obj;
	});
}
// GET
function doGet(request) {
	var func = 'callback';
	var data = getData('1XI8saHIXPy6FSkF_hC8GnAk7sYTtl7TNYBLORxwz2Og', 'Sheet1');
	// スプレッドシートのデータをJSONP形式で返す
	return ContentService.createTextOutput(func + '(' + xss(JSON.stringify(data, null, 2)) + ')').setMimeType(
		ContentService.MimeType.JAVASCRIPT);
}
// JSONPにXSS対策をする
function xss(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;');
};
