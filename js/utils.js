  //获取audio
  window.audio = $('#audio')[0];
  //根据歌曲的id获取音频
  //http://www.arthurdon.top:3000/song/url?id=1398294372
  var baseAudioUrl = 'http://www.arthurdon.top:3000/song/url?id=';



  //格式化时间，接收一个单位毫秒的参数
  function formatTime(m) {
    //将毫秒转换为秒
    var second = Math.floor(m / 1000 % 60);

    second = second >= 10 ? second : '0' + second;

    //将毫秒转换为分钟
    var minute = Math.floor(m / 1000 / 60);

    minute = minute >= 10 ? minute : '0' + minute;

    return minute + ':' + second;
  }



  function createDetails(result) {
    $.each($(".child-list>span"), function (i, v) {
      $(v).removeClass("active")
    })
    $(".child-list span").eq(1).addClass("active")
    $(".main").css("display", "none")
    $(".details").css({
      display: "block"
    })

    $(".sheet-details .sheet-img>img").attr("src", result.playlist.coverImgUrl)
    $(".sheet-text .sheet-name").text(result.playlist.name)
    $(".sheet-text .sheet-description").text(result.playlist.description)

    var Detailssong = result.playlist.tracks
    $('.detailssong-info').empty()
    console.log(Detailssong)
    $.each(Detailssong, function (i, v) {

      var div = $(

        `<div class="detailssong-item" data-id="${v.id}" data-play='0'>
         <div class="detailssong-img">
            <img class="auto-img" src="${v.al.picUrl}" />
         </div>
         <div class="detailssong-item-info">
             <div class="t1 one-text1 detailssong-name">${v.name}</div>
             <div class="t2 one-text1 detailssongsinger-name">${v.ar[0].name}</div>
         </div>
         <div class="detailssong-time">${formatTime(v.dt)}</div>
         <div class="playmusic">
            <img src="./icons/play3.png" alt="">
     </div>
     </div>`
      );

      $('.detailssong-info').append(div);

    })
  }

var itemName = null

  //点击播放音乐的方法
  function playMusic(id, songname, singername, singerimg) {
    $.ajax({
      type: 'GET',
      url: baseAudioUrl + id,
      success: function (result) {
        var songurl = result.data[0].url
        console.log(result)
        $(audio).attr('src', songurl)
        audio.oncanplay = function () {
          audio.play()
          $(".singer-avatar>img").attr("src", singerimg)
          $(".singer-avatar").addClass("active")
          $(".singer-info>.song-name").text(songname)
          $(".singer-info>.singer").text(singername)
          $('.controls').attr('name', 1)
          $(".controls-icons>.play").css({
            background: 'url("./icons/play2.png") no-repeat center center'
          })
        }
      }
    })
  }

  //点击停止音乐
  function pauseMusic() {
    audio.pause()
    $(".singer-avatar").removeClass("active")
    $('.controls').attr('name', 0)
    $(".controls-icons>.play").css({
      background: 'url("./icons/play.png") no-repeat center center'
    })

  }

  //控制台暂停播放
  function toggleMusicStatus() {
    var controlsName = $('.controls').attr('name');

    if (controlsName == 0) {
      //播放
      audio.play();
      $('.controls').attr('name', 1);
      $('.singer-avatar').addClass('active');
      $(".controls-icons>.play").css({
        background: 'url("./icons/play2.png") no-repeat center center'
      })
      $("."+itemName +".active").find('.playmusic img').attr("src", "./icons/play4.png");
      $("."+itemName +".active").data("play", "1")
    } else {
      //停止
      audio.pause();
      $('.controls').attr('name', 0);
      $('.singer-avatar').removeClass('active');
      $(".controls-icons>.play").css({
        background: 'url("./icons/play.png") no-repeat center center'
      })

      $("."+itemName +".active").find('.playmusic img').attr("src", "./icons/play3.png");
      $("."+itemName +".active").data("play", "0")
    }
  } 