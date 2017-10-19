$(function () {
    let id = getSongIdByName('id'),
        query = new AV.Query('Songs');

    function getSongIdByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function musicPauseAnimation() {
        $('.circle').toggleClass('play pause')
        $('.needle').toggleClass('needle-pause')
    }

    query.get(id).then(function (result) {
        var song = result.attributes,
            titleContent = song.name + song.singer + '-网易云音乐';
        $('title').html(titleContent);
        $("#songCover").attr('src', song.cover);
        $('.page-wrap').css('background', `url(${song.cover}) no-repeat center`)
        $('#songSrc').attr('src', song.url);
        // $('#songSrc').trigger('play')
    })

    $('#songSrc').on('canplay', function () {
        console.log('缓存完成')
        $('#songSrc').trigger('play')
        $('.circle').addClass('playing')
        $('.icon-wrap').addClass('playing')
    })

    $('.icon-pause-white').on('click', function () {
        $('#songSrc').trigger('pause')
        $('.icon-wrap').removeClass('playing')
        musicPauseAnimation()
    })
    $('.icon-play-white').on('click', function () {
        $('#songSrc').trigger('play')
        $('.icon-wrap').addClass('playing')
        musicPauseAnimation()
    })
})