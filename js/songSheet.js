$(function () {
    //开始截取下标
    var startIndex = 0;

    //截取数据数量
    var count = 12;

    //标记是否存在数据
    var isHas = true;



    function createsheet(data) {
        $.each(data, function (i, v) {

            var div = $(`<div id="${v.id}" class="Sheetinfo-item">
            <div class="Sheetinfo-info-layer">
                <div class="fr">
                    <span class="fl listen-icon"></span>
                    <span class="fl listen-count">${(v.playCount / 10000).toFixed(1)}万</span>
                </div>
            </div>
            <div class="info-img">
                <img class="auto-img" src="${v.coverImgUrl}" alt="">
            </div>
            <div class="Sheetinfo-text two-text">${v.name}</div>
        </div>`);

            $('.songSheet-info').append(div);

        })
    }
    //获取缓存推荐歌单数据
    var songSheetdata = localStorage.getItem('songSheetdata');
    //如果不存在缓存数据，则需要请求数据
    if (!songSheetdata) {
        //获取音乐库-推荐
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/top/playlist',
            success: function (result) {
                console.log('result ==> ', result);
                //缓存在本地存储
                localStorage.setItem('songSheetdata', JSON.stringify(result));
                songSheetdata = localStorage.getItem('songSheetdata')
                //歌单推荐展示12条数据
                createsheet(result.playlists.slice(startIndex, startIndex + count))

                //重置下次开始截取数据的下标
                startIndex += count;
            },

            error: function (err) {
                //请求失败
                console.log('err ==> ', err);
            }
        })
    } else {
        //歌单推荐展示12条数据
        createsheet(JSON.parse(songSheetdata).playlists.slice(startIndex, startIndex + count))

        //重置下次开始截取数据的下标
        startIndex += count;
    }



    //懒加载歌单数据
    //获取header高度
    var headerHeight = parseFloat($('header').css('height'));

    //保存当前滚动的所有定时器序号
    var timers = [];

    $('.songSheet').on('scroll', function () {
        if (!isHas) {
            console.log('没有更多数据可加载');
            return;
        }

        //保留当前this的指向
        var self = this;

        var timer = setTimeout(function () {

            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
            }

            var scrollTop = $(self).scrollTop()

            //获取最后一个节点
            var last = $('.Sheetinfo-item').last();
            var lastTop = last.offset().top;
            var lastHeight = parseFloat(last.css('height'));
            
            if (scrollTop + headerHeight + lastHeight + 5 >= lastTop) {
  
                //每次加载12条数据
                var songSheetdata = localStorage.getItem('songSheetdata')
                var data = JSON.parse(songSheetdata).playlists.slice(startIndex, startIndex + count);
                createsheet(data);
                //重置下次开始截取数据的下标
                startIndex += count;

                if (data.length < count) {
                    //本次不足12条数据，下次没有数据可加载
                    isHas = false;
                }
            }

            timers = [];
        }, 400)
        timers.push(timer);
    })



        //点击歌单进入详情页
        $(".songSheet-info").on("click", ".Sheetinfo-item", function () {
            $('.wait').css("display", "block")
            //根据歌单ID获取详细信息
            var sheetID = $(this).attr("id")
            $.ajax({
                type: 'GET',
                url: 'http://www.arthurdon.top:3000/playlist/detail?id=' + sheetID,
                success: function (result) {
                    $('.wait').css("display", "none")
                    console.log('sheetID ==> ', result);
                    createDetails(result) 
                },
    
                error: function (err) {
                    //请求失败
                    $('.wait').css("display", "none")
                    console.log('err ==> ', err);
                }
            })
    
    
            
        })


        // 点击歌曲播放
    $(".detailssong-info").on("click", '.detailssong-item',function () {
        var _This = $(this)
        itemName = $(this).attr("class")
        if ($(this).data("play") == "0") {
            $(this).siblings(".active").find(".playmusic img").attr('src', "./icons/play3.png")
            $(this).siblings(".active").removeClass("active")

            $(this).data("play", '1')
            $(this).addClass("active")
            $(this).find(".playmusic img").attr('src', "./icons/play4.png")

            var sname = $(this).find(".detailssong-name").text()
            var aname = $(this).find(".detailssongsinger-name").text()
            var simg = $(this).find(".detailssong-img img").attr("src")

            playMusic($(this).data('id'), sname, aname, simg)
        } else {
            $(this).data("play", '0')
            $(this).removeClass("active")
            $(this).find(".playmusic img").attr('src', "./icons/play3.png")
            pauseMusic()
        }

        audio.onended = function () {
            _This.data("play", '0')
            _This.removeClass("active")
            _This.find(".playmusic img").attr('src', "./icons/play3.png")
            pauseMusic()
        }

    })


})