$(function () {
  //改变导航栏
    $(".child-list>span").on("click", function () {
        $.each($(".child-list>span"), function (i, v) {
            $(v).removeClass("active")
        })
        $(this).addClass("active")

        $(".main").css("display", "none")
        $("." + $(this).data("module")).css("display", "block")
        $('.details').css("display", "none")
    })

    function createRecommendsheet(data) {
        $.each(data, function (i, v) {

            var div = $(`<div id="${v.id}" class="info-item">
                <div class="recommend-info-layer">
                  <div class="fr">
                    <span class="fl listen-icon"></span>
                    <span class="fl listen-count">${(v.playCount / 10000).toFixed(1)}万</span>
                  </div>
                </div>
                <div class="info-img">
                  <img class="auto-img" src="${v.picUrl}" alt="">
                </div>
                <div class="recommend-info-text two-text">${v.name}</div>
              </div>`);

            $('.recommend-info').append(div);

        })
    }

    //获取音乐库-推荐
    $.ajax({
        type: 'GET',
        url: 'http://www.arthurdon.top:3000/personalized',
        success: function (result) {
            console.log('result ==> ', result);
            //缓存在本地存储
            // localStorage.setItem('recommendSheetInfo', JSON.stringify(result));
            //获取缓存推荐歌单数据
            // var recommendSheetInfo = localStorage.getItem('recommendSheetInfo');
            //歌单推荐展示6条数据
            recommendSheetInfo = result.result.slice(0, 6);
            createRecommendsheet(recommendSheetInfo)
        },

        error: function (err) {
            //请求失败
            console.log('err ==> ', err);
        }
    })


    //点击歌单进入详情页
    $(".recommend-info").on("click", ".info-item", function () {
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
                console.log('err ==> ', err);
            }
        })



        
    })

    function createNewsongInfo(data) {
        $.each(data, function (i, v) {

            var div = $(`<div class="newsongs-list-item" data-id="${v.id}" data-play='0'>
              <div class="newsongs-img">
                  <img class="auto-img" src="${v.song.album.blurPicUrl}" />
              </div>
              <div class="newsongs-info">
                  <div class="t1 one-text1 newsong-name">${v.name}</div>
                  <div class="t2 one-text1 newsinger-name">${v.song.artists[0].name}</div>
              </div>
              <div class="newsongs-time">${formatTime(v.song.hMusic.playTime)}</div>
              <div class="playmusic">
                 <img src="./icons/play3.png" alt="">
              </div>
          </div>`);

            $('.recommend-newsong-info').append(div);

        })
    }
    //获取音乐库-推荐
    $.ajax({
        type: 'GET',
        url: 'http://www.arthurdon.top:3000/personalized/newsong',
        success: function (result) {
            console.log('result ==> ', result);

            //歌单推荐展示10条数据
            var recommendNewsongInfo = result.result.slice(0, 10);
            createNewsongInfo(recommendNewsongInfo)
        },

        error: function (err) {
            //请求失败
            console.log('err ==> ', err);
        }
    })



// 点击推荐歌曲播放
    $(".recommend-newsong-info").on("click", '.newsongs-list-item',function () {
        var _This = $(this)
        itemName = $(this).attr("class")
        if ($(this).data("play") == "0") {
            $(this).siblings(".active").find(".playmusic img").attr('src', "./icons/play3.png")
            $(this).siblings(".active").removeClass("active")

            $(this).data("play", '1')
            $(this).addClass("active")
            $(this).find(".playmusic img").attr('src', "./icons/play4.png")

            var sname = $(this).find(".newsong-name").text()
            var aname = $(this).find(".newsinger-name").text()
            var simg = $(this).find(".newsongs-img img").attr("src")

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

//点击控制台播放暂停歌曲
    $(".controls-icons>.play").on("click", function () {
// console.log($("."+itemName +".active"))
        var isHasUrl = audio.getAttribute('src');
        //如果不存url
        if (!isHasUrl) {
            console.log('音频不存在');
            return;
        }
        //暂停与播放
        toggleMusicStatus();

    })

})