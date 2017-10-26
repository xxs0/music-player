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
        let lyrics = lyric.split('\\n'),
            regex = /^\[(.+)\](.*)$/,
            array = [];
        lyrics.forEach(function (key) {
            let matchs = key.match(regex)
            if (matchs && matchs[2] !== '') {
                let time = matchs[1].match(/(\d+):([\d.]+)/),
                    minute = +time[1],
                    second = +time[2];
                array.push({
                    time: minute * 60 + second,
                    lyric: matchs[2]
                })
            }
        })
        array.forEach(function (key) {
            let $p = $('<p></p>');
            if (!key) {return}
            $p.attr('data-time', key.time).text(key.lyric)
            $lyricLine.append($p)
        })
        setInterval(function () {
            let currentTime = $('#songSrc').get(0).currentTime,
                $lines = $('.lyric-lines > p'),
                $currentLine;
            for (var i = 0; i <array.length; i++) {
                if ($lines.eq(1).length !== 0 && currentTime >= array[i].time && currentTime < array[i+1].time) {
                    $currentLine = $lines.eq(i)
                }
            }
            if ($currentLine) {
                let top = $currentLine.offset().top,
                    lyricWrapperTop = $lyricLine.offset().top,
                    moveupHeight = Math.floor(top - lyricWrapperTop - $('.lyric-wrap').height() / 3);
                $currentLine.addClass('active').prev().removeClass('active')
                $lyricLine.css('transform', `translateY(-${moveupHeight}px)`)
            }
        }, 500)
    }

    query.get(id).then(function (result) {
        var song = result.attributes,
            titleContent = song.name + '-' + song.singer + '-网易云音乐';
        string = result.attributes
        console.log(song)
        $('title').html(titleContent);
        $("#songCover").attr('src', song.cover);
        $('.page-wrap').css('background', `url(${song.cover}) no-repeat center`)
        $('#songSrc').attr('src', song.url);
        $('.song-name').text(song.name)
        $('.song-space').text('-')
        $('.song-singer').text(song.singer)
        parseLyric(song.lyric)
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