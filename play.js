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
        titleContent = song.name + song.singer + '-网易云音乐',
        style = {
            background: song.cover + 'no-repeat',
            backgroundSize: "cover"
        };
    console.log(titleContent)
    $('title').html(titleContent);
    $("#songCover").attr('src',song.cover);
    $('.page-wrap').css('background',`url(${song.cover}) no-repeat center`)
    // $(".needle").css(style);
    $('#songSrc').attr('src',song.url);
    $('#songSrc').trigger('play')
})

$('#playButton').on('click', function () {
    console.log('click')
    if ($('#songSrc')[0].pasue) {
        $('#songSrc').trigger('play')
        musicPauseAnimation()
    } else {
        $('#songSrc').trigger('pause')
        musicPauseAnimation()
    }
})
