// 初期表示処理
$(function () {
	// アニメーション表示
	playAnimation();
	// スプレッドシートのデータをGASでJSONP形式として受け取る
	var jsonpData = {
		search: function (query) {
			var defer = $.Deferred();
			$.ajax({
				type: 'GET',
				url: 'https://script.google.com/macros/s/AKfycbw9sT_7f7Df8h99xqnjIJkjxj6l4QAiS2XnrE8C3Ar-uuKEh6vd/exec',
				cache: false,
				jsonpCallback: 'callback',
				contentType: "application/javascript; charset=utf-8",
				dataType: 'jsonp',
				success: defer.resolve,
				error: defer.reject
			});
			return defer.promise();
		}
	};
	jsonpData.search('jquery deferred').done(function (json) {
		// ジャンル、歌手、関連作品名でソートをする
		json.sort(function (a, b) {
			a.GENRE < b.GENRE ? -1 : 1;
			a.ARTIST < b.ARTIST ? -1 : 1;
			a.RELATED < b.RELATED ? -1 : 1;
			return 0;
		});
		// セッションストレージにJSON形式を保存
		sessionStorage.setItem('jsonData', JSON.stringify(json));
		// JSONの件数を取得(検索結果件数表示用)
		var jsonCount = json.length;
		// 今日の日付を数値として取得
		var TodayNum = getNowYMD();
		// テーブルに表示させる値を用意
		var teble_add = "";
		// JSONの件数文ループ
		json.forEach(data => {
			// 歌えない曲の場合
			if (data.USE_FLG === 0) {
				// 検索件数をデクリメントして検索結果に表示させない
				jsonCount--;
				// 歌える曲の場合
			} else {
				// 最近追加された曲の場合はテーブルを赤くする
				teble_add += data.UPD_DATE > TodayNum ? '<tr><td bgcolor="#ffe4e1">' : '<tr><td>';
				// 関連作品が存在する場合は曲名(関連作品名) 歌手名を表示させる
				teble_add += data.RELATED != "" ?
					`${data.MUSIC_TITLE} (<span class="uk-text-success">${data.RELATED}</span>)<br><small>${data.ARTIST}</small></td></tr>` :
					`${data.MUSIC_TITLE}<br><small>${data.ARTIST}</small></td></tr>`;
			}
		});
		// テーブルタグに検索結果を貼り付ける
		$('#table').append(teble_add);
		// 検索件数を貼り付ける
		$('#size').append(jsonCount);
	});
});

function playAnimation() {
	var h = $(window).height();
	$('#wrap').css('display', 'none');
	$('#loader-bg ,#loader').height(h).css('display', 'block');
}
//全ての読み込みが完了したらアニメーションを消す
$(window).on('load', function () {
	$('#loader-bg').delay(900).fadeOut(800);
	$('#loader').delay(600).fadeOut(300);
	$('#wrap').css('display', 'block');
});

function search() {
	// セッションストレージのJSONを取り出す
	var json = JSON.parse(sessionStorage.getItem('jsonData'));
	// 入力されたジャンルを取得
	var genre = $('#genre').val();
	// 入力された曲名を取得
	var word = $('#freeword').val();
	// チェックボックスの値を取得
	var use_flg = $("[name=use_flg]").prop("checked") ? 1 : 0;
	// JSONの内容を順に走査
	json = $.grep(json, function (colum, index) {
		// チェックボックスに合わせた結果に絞る
		return (use_flg == colum.USE_FLG);
	});
	// ジャンルの入力判定
	json = (genre.length == 0) ? json : $.grep(json, function (colum, index) {
		// ジャンルで絞る
		return (colum.GENRE == genre);
	});
	// フリーワードの入力判定
	json = (word.length == 0) ? json : $.grep(json, function (colum, index) {
		var title = new String(colum.MUSIC_TITLE);
		var artist = new String(colum.ARTIST);
		var related = new String(colum.RELATED);
		var searchResult = false;
		// 曲名で検索
		searchResult = title.indexOf(word) > -1 ? true : searchResult;
		// 歌手名で検索
		searchResult = artist.indexOf(word) > -1 ? true : searchResult;
		// 関連作品名で検索
		searchResult = related.indexOf(word) > -1 ? true : searchResult;
		return searchResult;
	});
	// 検索結果と検索件数の表示を初期化
	$("#table").empty();
	$("#size").empty();
	// 検索件数を取得
	var jsonCount = json.length;
	// 検索件数を表示
	$('#size').append(jsonCount);
	// 今日の日付を数値として取得
	var TodayNum = getNowYMD();
	// テーブルに表示させる値を用意
	var teble_add = "";
	// JSONの件数文ループ
	json.forEach(data => {
		// 最近追加された曲の場合はテーブルを赤くする
		teble_add += data.UPD_DATE > TodayNum ? '<tr><td bgcolor="#ffe4e1">' : '<tr><td>';
		// 関連作品が存在する場合は曲名(関連作品名) 歌手名を表示させる
		teble_add += data.RELATED != "" ?
			`${data.MUSIC_TITLE} (<span class="uk-text-success">${data.RELATED}</span>)<br><small>${data.ARTIST}</small></td></tr>` :
			`${data.MUSIC_TITLE}<br><small>${data.ARTIST}</small></td></tr>`;
	})
	// テーブルタグに検索結果を貼り付ける
	$('#table').append(teble_add);
}
// 今日の日付を数字で取得
function getNowYMD() {
	var dt = new Date();
	var y = dt.getFullYear();
	var m = ("00" + (dt.getMonth() + 1)).slice(-2);
	var d = ("00" + dt.getDate()).slice(-2);
	var result = y + m + d;
	return result;
}
// ネギの処理
$(function () {
	// ページトップへのスクロール
	$('#pagetop').click(function () {
		// ネギがクリックされたら、以下の処理を実行
		$("html,body").animate({
			scrollTop: 0
		}, "300");
	});
	// ネギの表示・非表示
	$('#pagetop').hide();
	$(window).scroll(function () {
		$(window).scrollTop() > 200 ? $('#pagetop').slideDown(800) : $('#pagetop').slideUp(800);
	});
});