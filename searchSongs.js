var $searchResult = $('ul.searchResult');
$('#search').on('input change', function (e) {
    $('label.holder').hide()
    $('.hot-suggestion').hide()
    $('#clearSearch').show()
    $('.bestMatch').show()
    $searchResult.empty()
    let $input = $(e.currentTarget),
        value = $input.val();
    console.log(value)
    var nameQuery = new AV.Query('Songs');
    nameQuery.contains('name', value);

    var singerQuery = new AV.Query('Songs');
    singerQuery.contains('singer', value);

    var albumQuery = new AV.Query('Songs');
    albumQuery.contains('album', value);

    var query = AV.Query.or(nameQuery, singerQuery, albumQuery);
    if (value === '') {
        $('label.holder').show()
        $('.hot-suggestion').show()
        $('#clearSearch').hide()
        $('.bestMatch').hide()
        return
    }
    query.find().then(function (result) {
        console.log(result)
        if (result.length === 0) {
            $searchResult.append('<p class="no-result">暂时没有搜索结果</p>')
        } else {
            for (var i = 0; i < result.length; i++) {
                var song = result[i].attributes,
                    newSongTemplate =
                        '<li><a href="./song.html?id='
                        + result[i].id
                        + '"><h3 class="song-name">'
                        + song.name
                        + '</h3><p class="song-author"><svg class="icon icon-sq" aria-hidden="true"><use xlink:href="#icon-sq"></use></svg>'
                        + song.singer + '-' + song.album
                        + '</p><span class="playicon"><svg class="icon icon-play" aria-hidden="true"><use xlink:href="#icon-play"></use></svg></span></a></li>';
                $searchResult.append(newSongTemplate)
            }
        }
    })
})

$('#clearSearch').on('click', function (e) {
    console.log(1)
    $('#search').val('').focus()
    $(this).hide()
    $('label.holder').show()
    $('.hot-suggestion').show()
    $searchResult.html('')
})
