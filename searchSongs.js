var $searchResult = $('ul.searchResult');
let timer = null

$('#search').on('input', function (e) {
    prepareSearch()
    $searchResult.empty()
    let $input = $(e.currentTarget),
        value = $input.val();
    if (value === '') {
        clearResult()
        return
    }
    throttling(400, value, function () {
        searching(value).then(renderResult)
    })

})

$('#clearSearch').on('click', function (e) {
    $('#search').val('').focus()
    $searchResult.html('')
    clearResult()
})

$('.suggestion').on('click', 'li', function (e) {
    let value = e.currentTarget.innerText.trim()
    prepareSearch()
    if (value !== '') {
        $('#search').val(value)
        throttling(400, value, function () {
            searching(value).then(renderResult)
        })
    }
})

// 函数截流
function throttling(time, value, fn) {
    if (timer) {
        window.clearTimeout(timer)
    }
    timer = setTimeout(function () {
        console.log('实践')
        timer = null
        fn(value)
    }, time)
}

// 搜索歌曲
function searching(value) {
    var nameQuery = new AV.Query('Songs');
    nameQuery.contains('name', value);

    var singerQuery = new AV.Query('Songs');
    singerQuery.contains('singer', value);

    var albumQuery = new AV.Query('Songs');
    albumQuery.contains('album', value);

    var query = AV.Query.or(nameQuery, singerQuery, albumQuery);
    return query.find()
}

// 渲染数据
function renderResult(result) {
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
}

function clearResult() {
    $('label.holder').show()
    $('.hot-suggestion').show()
    $('#clearSearch').hide()
    $('.bestMatch').hide()
}

function prepareSearch() {
    $('label.holder').hide()
    $('.hot-suggestion').hide()
    $('#clearSearch').show()
    $('.bestMatch').show()
}
