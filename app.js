// �����\������
$(function () {
	// �A�j���[�V�����\��
	playAnimation();
	// �X�v���b�h�V�[�g�̃f�[�^��GAS��JSONP�`���Ƃ��Ď󂯎��
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
		// �W�������A�̎�A�֘A��i���Ń\�[�g������
		json.sort(function (a, b) {
			a.GENRE < b.GENRE ? -1 : 1;
			a.ARTIST < b.ARTIST ? -1 : 1;
			a.RELATED < b.RELATED ? -1 : 1;
			return 0;
		});
		// �Z�b�V�����X�g���[�W��JSON�`����ۑ�
		sessionStorage.setItem('jsonData', JSON.stringify(json));
		// JSON�̌������擾(�������ʌ����\���p)
		var jsonCount = json.length;
		// �����̓��t�𐔒l�Ƃ��Ď擾
		var TodayNum = getNowYMD();
		// �e�[�u���ɕ\��������l��p��
		var teble_add = "";
		// JSON�̌��������[�v
		json.forEach(data => {
			// �̂��Ȃ��Ȃ̏ꍇ
			if (data.USE_FLG === 0) {
				// �����������f�N�������g���Č������ʂɕ\�������Ȃ�
				jsonCount--;
				// �̂���Ȃ̏ꍇ
			} else {
				// �ŋߒǉ����ꂽ�Ȃ̏ꍇ�̓e�[�u����Ԃ�����
				teble_add += data.UPD_DATE > TodayNum ? '<tr><td bgcolor="#ffe4e1">' : '<tr><td>';
				// �֘A��i�����݂���ꍇ�͋Ȗ�(�֘A��i��) �̎薼��\��������
				teble_add += data.RELATED != "" ?
					`${data.MUSIC_TITLE} (<span class="uk-text-success">${data.RELATED}</span>)<br><small>${data.ARTIST}</small></td></tr>` :
					`${data.MUSIC_TITLE}<br><small>${data.ARTIST}</small></td></tr>`;
			}
		});
		// �e�[�u���^�O�Ɍ������ʂ�\��t����
		$('#table').append(teble_add);
		// ����������\��t����
		$('#size').append(jsonCount);
	});
});

function playAnimation() {
	var h = $(window).height();
	$('#wrap').css('display', 'none');
	$('#loader-bg ,#loader').height(h).css('display', 'block');
}
//�S�Ă̓ǂݍ��݂�����������A�j���[�V����������
$(window).on('load', function () {
	$('#loader-bg').delay(900).fadeOut(800);
	$('#loader').delay(600).fadeOut(300);
	$('#wrap').css('display', 'block');
});

function search() {
	// �Z�b�V�����X�g���[�W��JSON�����o��
	var json = JSON.parse(sessionStorage.getItem('jsonData'));
	// ���͂��ꂽ�W���������擾
	var genre = $('#genre').val();
	// ���͂��ꂽ�Ȗ����擾
	var word = $('#freeword').val();
	// �`�F�b�N�{�b�N�X�̒l���擾
	var use_flg = $("[name=use_flg]").prop("checked") ? 1 : 0;
	// JSON�̓��e�����ɑ���
	json = $.grep(json, function (colum, index) {
		// �`�F�b�N�{�b�N�X�ɍ��킹�����ʂɍi��
		return (use_flg == colum.USE_FLG);
	});
	// �W�������̓��͔���
	json = (genre.length == 0) ? json : $.grep(json, function (colum, index) {
		// �W�������ōi��
		return (colum.GENRE == genre);
	});
	// �t���[���[�h�̓��͔���
	json = (word.length == 0) ? json : $.grep(json, function (colum, index) {
		var title = new String(colum.MUSIC_TITLE);
		var artist = new String(colum.ARTIST);
		var related = new String(colum.RELATED);
		var searchResult = false;
		// �Ȗ��Ō���
		searchResult = title.indexOf(word) > -1 ? true : searchResult;
		// �̎薼�Ō���
		searchResult = artist.indexOf(word) > -1 ? true : searchResult;
		// �֘A��i���Ō���
		searchResult = related.indexOf(word) > -1 ? true : searchResult;
		return searchResult;
	});
	// �������ʂƌ��������̕\����������
	$("#table").empty();
	$("#size").empty();
	// �����������擾
	var jsonCount = json.length;
	// ����������\��
	$('#size').append(jsonCount);
	// �����̓��t�𐔒l�Ƃ��Ď擾
	var TodayNum = getNowYMD();
	// �e�[�u���ɕ\��������l��p��
	var teble_add = "";
	// JSON�̌��������[�v
	json.forEach(data => {
		// �ŋߒǉ����ꂽ�Ȃ̏ꍇ�̓e�[�u����Ԃ�����
		teble_add += data.UPD_DATE > TodayNum ? '<tr><td bgcolor="#ffe4e1">' : '<tr><td>';
		// �֘A��i�����݂���ꍇ�͋Ȗ�(�֘A��i��) �̎薼��\��������
		teble_add += data.RELATED != "" ?
			`${data.MUSIC_TITLE} (<span class="uk-text-success">${data.RELATED}</span>)<br><small>${data.ARTIST}</small></td></tr>` :
			`${data.MUSIC_TITLE}<br><small>${data.ARTIST}</small></td></tr>`;
	})
	// �e�[�u���^�O�Ɍ������ʂ�\��t����
	$('#table').append(teble_add);
}
// �����̓��t�𐔎��Ŏ擾
function getNowYMD() {
	var dt = new Date();
	var y = dt.getFullYear();
	var m = ("00" + (dt.getMonth() + 1)).slice(-2);
	var d = ("00" + dt.getDate()).slice(-2);
	var result = y + m + d;
	return result;
}
// �l�M�̏���
$(function () {
	// �y�[�W�g�b�v�ւ̃X�N���[��
	$('#pagetop').click(function () {
		// �l�M���N���b�N���ꂽ��A�ȉ��̏��������s
		$("html,body").animate({
			scrollTop: 0
		}, "300");
	});
	// �l�M�̕\���E��\��
	$('#pagetop').hide();
	$(window).scroll(function () {
		$(window).scrollTop() > 200 ? $('#pagetop').slideDown(800) : $('#pagetop').slideUp(800);
	});
});