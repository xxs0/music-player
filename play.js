$(function () {
    let id = getSongIdByName('id'),
        query = new AV.Query('Songs'),
        $lyricLine = $('.lyric-lines');

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
    
    function parseLyric(lyric) {
        console.log(lyric)
        let lyrics = lyric.split('\n'),
            regex = /^\[(.+)\](.*)$/,
            array = [];
        console.log(lyrics)
        lyrics.forEach(function (key, index) {
            let matchs = key.match(regex)
            if (matchs && matchs[1] !== '') {
                array.push({
                    time: matchs[0],
                    lyric: matchs[1]
                })
            }
        })
        console.log(array)
        array.forEach(function (key) {
            let $p = $('p');
            if (!key) {return}
            $p.attr('data-time', key.time).text(key.lyric)
        })
        $lyricLine.append($p)
    }

    query.get(id).then(function (result) {
        var song = result.attributes,
            titleContent = song.name + '-' + song.singer + '-网易云音乐';
        console.log(song)
        $('title').html(titleContent);
        $("#songCover").attr('src', song.cover);
        $('.page-wrap').css('background', `url(${song.cover}) no-repeat center`)
        $('#songSrc').attr('src', song.url);
        $('.song-name').text(song.name)
        $('.song-space').text('-')
        $('.song-singer').text(song.singer)
        console.log("准备歌词")
        // parseLyric(song.lyric)
        console.log('完毕')
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

    $('html').one('touchstart', function () {
        $('#songSrc').trigger('play')
    })
})