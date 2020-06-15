
//var users = null;
var flag = false;//判断用户是否处于登录状态
$(function () {
    //使用ajax从后台获得用户数据
    // $.ajax({
    //     url: "usermsg.json",
    //     method: "get",
    //     success: function (res) {
    //         users = res;
    //     }
    // });
    // console.log(users);
    
    //渲染播放列表
    $.each(data, function (index, item) {
        var $li = $(`<li onclick = "play(${index})"> 第${index + 1}首  -  歌曲名：${item.song}&nbsp&nbsp&nbsp   歌手：&nbsp ${item.singer} </li>`);
        $(".wrap").append($li);
    });
    //渲染歌曲数目
    $(".song-con-bd .num").html(data.length);
    //渲染第一首歌曲的相关信息
    $(".disc").attr("src", data[0].cover);
    $(".song-name").html(data[0].song);
    $(".singer").html(data[0].singer);
    $(".album:first").html(data[0].album);
    $("audio").attr("src", data[0].url);
    $("audio").attr("index", 0);
    $(".mode").attr("index", 0);
    loadComment(0);  //渲染第一首歌曲的评论部分
    $.each(lrcs[0].lyric, function (index, ele) {
        $(".lyrics").append($(`<li>${ele.lineLyric}</li>`));
    });
    // 为播放按钮、前一首和后一首按钮绑定点击事件
    //播放按钮
    $(".controls a:nth-child(2)").click(function () {
        $("audio").get(0).paused ? $("audio").get(0).play() : $("audio").get(0).pause();
        $("audio").get(0).paused ? $(this).removeClass("play") : $(this).addClass("play");
    });
    //播放上一首按钮
    $(".prev").click(function () {
        var index = parseInt($("audio").attr("index"));
        index = (index == 0) ? data.length - 1 : index - 1;
        play(index);

        $(".desk_lyric_part").empty();
    });
    //播放下一首按钮
    $(".next").click(playnext);

    // 歌曲播放时唱片旋转
    $("audio").get(0).addEventListener('playing', function () {
        $(".disc").removeClass("playing-pause");
        $(".disc").addClass("playing");
        //歌曲播放时将时间长度给时间进度条
        $(".time input[type='range']").attr({
            max: this.duration,
            min: 0
        });
        // 计算歌曲时间
        var time = parseInt(this.duration);
        var m = parseInt(time / 60);
        var s = parseInt(time % 60);
        s = (s < 10) ? '0' + s : s;
        m = (m < 10) ? '0' + m : m;
        $(".end-m").html(m);
        $(".end-s").html(s);

    });
    // 歌曲暂停时唱片停止旋转
    $("audio").get(0).addEventListener('pause', function () {
        $(".disc").addClass("playing-pause");
    });
    // 歌曲结束后播放下一首
    $("audio").get(0).addEventListener('ended', playnext);
    // 歌曲时间控制
    $(".time input[type='range']").change(function () {
        $("audio").get(0).currentTime = $(this).val();
        $("audio").get(0).addEventListener('timeupdate', updateTime);
        updateTime();
    });
    $("audio").get(0).addEventListener('timeupdate', updateTime);//更新时间进度条

    $(".time input[type='range']").get(0).addEventListener('input', function () {
        $("audio").get(0).removeEventListener('timeupdate', updateTime);
    });
    //音量按钮控制
    $(".volume input[type='range']").change(function () {
        $("audio").get(0).volume = $(this).val();
    });
    //音量按钮
    $(".bell").click(function () {
        var moding = parseInt($(this).attr("index"));
        if (moding == 1) {
            $("audio").get(0).volume = 0;
            $(this).css("backgroundPosition", "-1.33rem -0.74rem");
        } else {
            $("audio").get(0).volume = $(".volume input[type='range']").val();
            $(this).css("backgroundPosition", "-.05rem -2.51rem");//todo 修改一下音量按钮的背景图片
        }
        moding = (moding + 1) % 2;
        $(this).attr("index", moding);
    });
    // 点击显示和隐藏播放列表
    $(".song-lists").click(function () {
        $(".song-con").slideToggle();
    });
    //播放列表中歌曲被选中时样式改变
    $(".wrap li").click(function () {
        $(this).css("background", "pink").siblings("li").css("background", "none");
    });
    // 点击按钮切换播放模式
    $(".mode").click(function () {
        var index = parseInt($(this).attr("index"));
        index = (index == 2) ? 0 : index + 1;
        $(this).attr("index", index);
        (index == 0) && $(this).css("backgroundPosition", "-0.06rem -3.46rem");
        (index == 1) && $(this).css("backgroundPosition", "-0.69rem -3.47rem");
        (index == 2) && $(this).css("backgroundPosition", "-0.69rem -2.52rem");
    });
    //点击按钮显示桌面歌词
    $(".desk-lyric").click(function () {
        $(".desk_lyric_part").toggle();
    });
    // 皮肤按钮绑定事件
    $(".login input[type='color']").change(function () {
        $("header").css("background", $(this).val());
        $(".playbar").css("background", $(this).val());
    });
    //点击登录按钮显示登录窗口
    $(".login a:first").click(function () {
        if ($(this).text() == '登录') {
            $(".user-login").show();
        } else {
            flag = false;
            $(this).text("登录");
            $(".userId").text("");
        }

    });
    //点击关闭按钮关闭登录窗口
    $(".user-login .clo").click(function () {
        $(".user-login").hide();
    });
    //绑定登录按钮判断用户是否登陆成功
    $(".logon").click(function () {
        if (flag) {
            alert('您已经登录，请退出当前账号后登录！');
            return false;
        }
        var uname = $(this).parent().find("input[type='text']").val();
        var password = $(this).parent().find("input[type='password']").val();
        $.each(users, function (index, ele) {
            if (ele.name == uname && ele.pwd == password) {
                flag = true;
                alert('登陆成功！');
                // 将登录换为退出文本  并且显示当前用户名  并且将用户名的id属性切换为当前用户的id属性 
                $(".login a:first").text("退出").prev().text(`用户${ele.name}，欢迎您`).attr("id", ele.id);
                $(".user-login").hide();
                $(".user-login input[type='text']").val("");
                var check = $(".user-login input[type='checkbox']");
                var value = $(".user-login input[type='password']").val();
                (check.is(":checked")) ? $(".user-login input[type='password']").val(value)
                    : $(".user-login input[type='password']").val(""); //如果记住按钮复选框被选中，则保留密码   否则删除密码           
            }
        });
        if (!flag) {
            alert('用户或密码输入不正确，请重新输入！');
        }
    });
    //  发布评论区获得鼠标时不显示提示文本
    $(".comments-input textarea").on("focus", function () {
        ($(this).val() == "按下回车键发表评论") && $(this).val("");
    });
    //  回到发布评论区以外 若无文本 则显示提示文本
    $(".comments-input textarea").on("blur", function () {
        ($(this).val() == "") && $(this).val("按下回车键发表评论");
    });
    // 在发布评论区按下回车不会换行 
    $(".comments-input textarea").on("keydown", function (e) {
        if (e.keyCode == 13) {
            e.cancelBubble = true;
            e.preventDefault();
            e.stopPropagation();
        }
    });
    //按下回车键发布评论
    $(".comments-input textarea").on("keyup", function (e) {
        if (e.keyCode == 13) {
            if (!flag) {
                alert('您尚未登录，请登录账号后发布评论');
            } else {
                var content = $(this).val();//获取当前评论内容
                var num = parseInt($("audio").attr("index"));//获取当前播放歌曲的序号
                var id = parseInt($(".userId").attr("id"));//获取当前用户的 id
                addComment(num, id, content);//开始调用添加评论的函数
                $(this).val("");
            }
        }
    });

});
// 函数部分
// 1.按歌曲序号播放对应歌曲
function play(num) {
    $(".disc").attr("src", data[num].cover);//更换唱片
    $(".song-name").html(data[num].song);//更换歌曲名字
    $(".singer").html(data[num].singer);//更换歌手名字
    $(".album:first").html(data[num].album);//更换专辑名
    $("audio").attr("src", data[num].url);//切换至当前歌曲的音频
    $(".lyrics").empty();
    $.each(lrcs[num].lyric, function (index, ele) {
        $(".lyrics").append($(`<li>${ele.lineLyric}</li>`));//从数据中渲染当前歌曲的歌词
    });
    $(".disc").removeClass("playing");//唱片停止旋转 下一首音乐播放时从头再开始旋转
    $("audio").get(0).play();
    loadComment(num);//开始渲染当前播放歌曲的评论区
    $(".time input[type='range']").attr({
        max: $("audio").attr("duration"),
        min: 0
    });
    $("audio").attr("index", num);//更换当前播放的歌曲序号
    $(".controls a:nth-child(2)").addClass("play");//将播放按钮切换为暂停状态
    $(".desk_lyric_part").empty();
    //播放列表中对应的歌曲名字背景色改变
    $(".wrap li").eq(num).css("background", "pink").siblings("li").css("background", "none");

}
// 2.播放下一首歌曲
function playnext() {
    var index = parseInt($("audio").attr("index"));
    var mode = parseInt($(".mode").attr("index"));
    if (mode == 0) {
        index = (index == data.length - 1) ? 0 : index + 1;
    } else if (mode == 2) {
        index = Math.floor(Math.random() * (data.length));
    }
    play(index);
    $(".desk_lyric_part").empty();
}
// 3. 更新时间进度条
function updateTime() {
    //将当前播放时间给时间进度条
    var current_time = parseInt($("audio").get(0).currentTime);
    $(".time input[type='range']").val(current_time);
    //将当前播放时间转换为分和秒显示
    var m = parseInt(current_time / 60);
    m = (m < 10) ? '0' + m : m;
    var s = parseInt(current_time % 60);
    s = (s < 10) ? '0' + s : s;
    $(".start-m").html(m);
    $(".start-s").html(s);
    //当前播放时间内的歌词高亮显示并且滚动
    var i = $("audio").attr("index");
    $.each(lrcs[i].lyric, function (index, ele) {
        if (current_time > ele.time && current_time < lrcs[i].lyric[index + 1].time) {
            $(".lyrics li").eq(index).css({
                "color": "red"
            }).siblings("li").css({
                "color": "#000"
            });
            var h = $(".lyrics li").eq(index).height();
            $(".lyrics").scrollTop(index * h);            
            //桌面歌词渲染
            var content = $(".lyrics li").eq(index).text();
            $(".desk_lyric_part").html(content);
            $(".desk_lyric_part").css({
                "color": "#fff",
                "transform": "scale(1.2)"
            }).addClass("changed");
        }else if (current_time == ele.time - 1) {
            $(".desk_lyric_part").css({
                "transform": "scale(1)",
                "color": "gold",
            }).removeClass("changed");
        }
    });
}
// 4.渲染评论区
function loadComment(num) {
    $(".brilliant-comments ul").empty();//清空之前评论区的数据
    $(".comment-num").text(`(已有 ${data[num].msg.length} 条评论)`);
    $.each(data[num].msg, function (index, ele) {
        //可以根据数组的元素数量，构建评论区
        var $li = $(`<li>
                        <div class="pic">
                            <img src="http://p1.music.126.net/2diP5uOrailFol-qgmprUQ==/109951163243492839.jpg" alt="">
                        </div>
                        <div class="comments-part">
                            <p>
                                <i class="username">小柠檬</i>： 
                                <span class="txt"></span>
                            </p>
                            <div class="others">
                                <span class="date"></span>
                                <div class="function">
                                    <span class="likes-num">0</span>
                                    <a href="javascript:;" class="like" index="${index}" onclick="cal(this)">点赞|</a>
                                    <a href="javascript:;" class="reply" index="${index}" state="1" onclick="reply(this)">回复</a>
                                </div>
                            </div>
                        </div>
                    </li>`);
        var id = ele.userId;
        $.each(users, function (index, ele) {
            if (ele.id == id) {
                $li.find(".pic img").attr("src", ele.pic);//渲染用户头像图片
                $li.find(".username").text(ele.name);//渲染用户名
            }
        });
        $li.find(".comments-part .txt").text(ele.megCon);//渲染评论文本
        $li.find(".others .date").text(ele.date);//渲染评论日期
        $(".brilliant-comments ul").append($li);//创建完毕一条评论后添加到评论区
        $li.find(".likes-num").text(`(${ele.likes}) `);
        //若有回复内容 则渲染回复内容
        if (ele.reply) {
            $.each(ele.reply, function (index, ele) {
                var id = ele.userId;
                var con = ele.con;
                var date = ele.date;
                $.each(users, function (index, ele) {
                    if (ele.id == id) {
                        var $replySpan = $(`<p class="reply-con"><span>${ele.name}</span>   回复：${con}   ------- ${date}</p>`)

                        $li.find(".comments-part .others").before($replySpan);
                    }
                });
            });
        }
    });
}
//5.添加用户评论
function addComment(num, id, megCon) {
    var obj = {};
    var megId = data[num].msg.length + 1;
    var date = new Date();
    var nowTime = date.toLocaleString();
    obj.megId = megId;
    obj.megCon = megCon;
    obj.date = nowTime;
    obj.userId = id;
    obj.likes = "0";
    data[num].msg.push(obj);
    loadComment(num);//加载当前播放歌曲的评论区
}
//6.渲染的回复按钮绑定函数

function reply(a) {
    if(a.getAttribute("state")==0){//如果当前的状态值为0，则表示用户在按下回车键之前重复点击了回复按钮
        return false;
    }
    if (flag) {
        a.setAttribute("state","0");
        var $reply = $("<input type='text'>");
        $(a).parents(".others").after($reply);//添加临时的文本输入框
        var obj = {};
        var i = parseInt($(a).attr("index"));//获得当前回复按钮所在li的索引号  即为当前被点击回复的评论
        var num = parseInt($("audio").attr("index"));//获取当前歌曲的序号
        $reply.focus(); //文本框获得焦点
        $reply.on('keyup', function (e) {
            if (e.keyCode == 13) {
                var content = $reply.val();//按下回车键时获得文本框中的内容
                obj.userId = parseInt($(".userId").attr("id"));
                obj.con = content;
                var date = new Date();
                var nowTime = date.toLocaleString();                
                obj.date = nowTime;
                if (data[num].msg[i].reply) {
                    data[num].msg[i].reply.push(obj);
                } else {
                    data[num].msg[i].reply = [];
                    data[num].msg[i].reply.push(obj);
                }
                $reply.remove();
                loadComment(num);
                a.setAttribute("state","1");         
            }
        });
    } else {
        alert('请先登录后再评论!');
    }

}
//7. 计算点赞数量

function cal(a){
    if(flag){
        var num = parseInt($("audio").attr("index"));
        var i = parseInt($(a).attr("index"));
        var n = parseInt(data[num].msg[i].likes);
        n++;
        data[num].msg[i].likes = n;
        loadComment(num);
    }else{
        alert('请登录后再点赞！');
    }
    
}