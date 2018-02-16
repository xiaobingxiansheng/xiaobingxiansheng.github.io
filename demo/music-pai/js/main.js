/**
 * Created by lenovo on 2018/2/6.
 */
var MusicListLen = 0;
var index = 0;
var audioObj = null;
var musicListContainer = $(".music-list-container");
var musicSoundControl = $(".music-listenning");
var musicControl = $("footer");
var curMusicItem = null;
var curMusicIndex;
var MusicTimer = null;
var currentTime = 0;
//1顺序播放 2随机播放
var StartingType = 1;
//拖拽参数
var moving = false;
/**
 * 获取音乐列表
 */
function getMusicListByInterface(success){
    var array = [];
    openIndexedDataBase("myMusic",'1.0',function(event){
        //获取后端数据
        for(var i=0;i<dataMessage.length;i++){
            array.push(dataMessage[i]);
        }
        //加载到数据库
        pushIntoDataBase("myMusic",array);
        selectDataBase("myMusic",null,function(res,len){
            success&&success(res,len);
        });
    });

}

/**
 * 生成音乐列表
 */
function generateMusicItem(array){
    musicListContainer.innerHTML = getMusicTemplete(array);
}

/**
 * 获取音乐列表模板
 * @returns {string}
 */
function getMusicTemplete(array){
    var html = "";
    for(var i=0;i<array.length;i++){
        html += `
            <li class="music-list-item" data-id="${array[i].id}">
                <div>
                    <h2 class="first-title">${array[i].name}</h2>
                    <p class="second-title">${array[i].author}</p>
                </div>
                <span><i></i></span>
            </li>
        `;
    }
    return html;
}

function getMusicControlsTemplete(){
    return `<div class="music-info">
                <img class="music-info-AlbumImg" src="img/lzx.jpg" alt="">
                <hgroup>
                    <h1 class="first-title">${curMusicItem.name}</h1>
                    <h2 class="second-title">${curMusicItem.author}</h2>
                </hgroup>
            </div>
            <div class="music-control-circle">
                <i class="icon icon-start"></i>
            </div>
            `;
}


function getMusicSoundControlsTemplete(){
    return `<header class="music-listenning-header">
            <span><i class="icon icon-back"></i></span>
            <hgroup>
                <h1 class="listenning-name">${curMusicItem.name}</h1>
                <h3 class="listenning-author">${curMusicItem.author}</h3>
            </hgroup>
            <span><i class="icon icon-share"></i></span>
        </header>
        <div class="sound-record-container">
            <div class="outer-sound-record">
                <div class="outer-sound-light"></div>
                <div class="inner-sound-record">
                    <img src="../tecentClass_wechatGame/img/old/avatar-pai8.jpg" alt="">
                </div>
            </div>
        </div>
        <div class="sound-controls-container">
            <div class="Kichiku">
                <div class="Kichiku-kedu">
                    <span><i class="icon icon-youb"></i></span>
                </div>
                <div class="Kichiku-title">
                    <span>慢</span>
                    <span>中</span>
                    <span>快</span>
                </div>
            </div>
            <div class="sound-range">
                <span class="sound-range-curTime">00:00</span>
                <div class="sound-range-comment">
                    <div class="circle-range"></div>
                    <div class="rectangle-range">
                        <div class="full-rectangle-range"></div>
                    </div>
                </div>
                <span class="sound-range-endTime">${curMusicItem.long}</span>
            </div>
            <div class="sound-controls">
                <span class="icon icon-soundRadom"></span>
                <span class="icon icon-soundforWard"></span>
                <span class="icon icon-soundState"></span>
                <span class="icon icon-soundNext"></span>
                <span class="icon icon-soundMore"></span>
            </div>
        </div>`;
}

function refreshMusicControls(){
    musicControl.innerHTML = getMusicControlsTemplete();
    musicSoundControl.innerHTML = getMusicSoundControlsTemplete();
    //播放页事件
    musicSoundControlEvent();

}

/**
 * 初始化
 */
function init() {
    getMusicListByInterface(function(res,len){
        initAudio();
        generateMusicItem(res);
        MusicListLen = len;//更改列表长度
        $(".sound-num").innerHTML = len;

    });
}

/**
 * 缓存保存
 */
function saveStore(){
    localStorage.audioId = curMusicIndex;
}

/**
 * 初始化音频对象
 */
function initAudio(){
    curMusicIndex = typeof localStorage.audioId!='undefined'?localStorage.audioId:0;
    currentTime = typeof localStorage.currentTime!='undefined'?localStorage.currentTime:0;
    selectDataBase("myMusic",{'key':'id','value':+curMusicIndex},function(res){
        curMusicItem = res[0];
        audioObj = new Audio();
        audioObj.start = currentTime;
        audioObj.currentTime = currentTime;
        audioObj.src = curMusicItem.src;
        //加载控件
         refreshMusicControls();
        //播放控件事件
         event();
    })
}


/**
 * 音频状态
 */
function controlsChangeState(){
    if(audioObj.paused){
        audioObj.play();
    }else{
        audioObj.pause();
    }
}

/**
 * 切换icon状态
 */
function controlsChangeClass(isToggle){
        if(isToggle){
            removeClass($(".music-control-circle>.icon"),"icon-start");
            addClass($(".music-control-circle>.icon"),"icon-pause");
            addClass(musicSoundControl,"listenning");
        }else{
            addClass($(".music-control-circle>.icon"),"icon-start");
            removeClass($(".music-control-circle>.icon"),"icon-pause");
            removeClass(musicSoundControl,"listenning");
        }
}

/**
 * 播放页事件
 */
function musicSoundControlEvent(){
    $('.music-listenning-header .icon-back').addEventListener('touchend',function(e){
        removeClass(musicSoundControl,'fadeIn');
        addClass(musicSoundControl,'fadeOut');
        setTimeout(()=>{
            removeClass(musicSoundControl,'fadeOut');
            addClass(musicSoundControl,"dis-no");
        },300);
    });
    //播放控件
    $('.sound-controls .icon-soundState').addEventListener('touchend',controlsChangeState);
    $('.sound-controls .icon-soundNext').addEventListener('touchend',function(){
        toggleSound(1);
    });
    $('.sound-controls .icon-soundforWard').addEventListener('touchend',function(){
        toggleSound(0);
    });
    $('.sound-range-comment').addEventListener('touchmove',function(e){
        //获取拖拽信息
        var ProcessParamerObj = getProcessParamerByRangEvent(e.changedTouches[0].clientX);
        $(".sound-range-curTime").innerHTML = TimeStrbySecond(ProcessParamerObj.currentTime);
        $(".circle-range").style.left = ProcessParamerObj.currentLeft*100+"%";
        $(".full-rectangle-range").style.width = ProcessParamerObj.currentLeft*100+"%";
    });
    $('.sound-range-comment').addEventListener('touchend',function(e){
        audioObj.pause();
        audioObj.currentTime = getProcessParamerByRangEvent(e.changedTouches[0].clientX).currentTime;
        audioObj.play();
    });
    //鬼畜模式
    $('.Kichiku-kedu').addEventListener('touchend',function(e){
        //总长
        var allClientWidth = e.target.clientWidth;
        //半长
        var halfClientWidth = allClientWidth/2;
        //相对位置占总长比
        var curPosition = (e.changedTouches[0].clientX-getOffsetLeft(e.target))/allClientWidth;
        //相对位置占半长比
        var curHalfPosition = (e.changedTouches[0].clientX-getOffsetLeft(e.target))/halfClientWidth;
        if(curHalfPosition<1){//如果小于1就直接使用半长比
            defaultPlaybackRate = curHalfPosition;
        }else{//否则将半长比-1 算出占10的多少
            defaultPlaybackRate = (curHalfPosition-1)*10+1;
        }
        $(".Kichiku-kedu .icon-youb").style.left = curPosition*100+"%";
        audioObj.defaultPlaybackRate = defaultPlaybackRate;
    });
}

function getProcessParamerByRangEvent(pointerX){
    //获取进度条相关参数
    var rangWidth = $(".sound-range-comment").clientWidth;
    var rangLeft = getOffsetLeft( $(".sound-range-comment") );
    var curPointerX = pointerX-rangLeft;
    return {
        currentTime: curPointerX / rangWidth * audioObj.duration,
        currentLeft: curPointerX / rangWidth
    }
}

//基础事件
function event(){
    musicListContainer.addEventListener('touchend',function(e){
        eventHadler(e,"music-list-item",function(e){
            curMusicIndex = e.getAttribute("data-id");
            selectDataBase("myMusic",{'key':'id','value':+curMusicIndex},function(res){
                curMusicItem = res[0];
                refreshMusicControls();
                audioObj.autoPlay=true;
                audioObj.src = curMusicItem.src;
                audioObj.play();
                saveStore();
            })

        })
    });
    musicControl.addEventListener('touchend',function(e){
        //如果不触发播放按钮，则打开播放页
        if(!eventHadler(e,"music-control-circle",controlsChangeState)){
            removeClass(musicSoundControl,"dis-no");
            setTimeout(()=>{
                addClass(musicSoundControl,"fadeIn");
            },100);
        }
    });
    audioObj.addEventListener('playing', function(){
        controlsChangeClass(1);
        // //进度渲染
        // changeMusicProess();
        // MusicTimer = setInterval(()=>{
        //     changeMusicProess();
        // },1000);
    });
    audioObj.addEventListener('pause', function(){
        controlsChangeClass(0);
        MusicTimer = null;
        clearInterval(MusicTimer);
    });
    audioObj.addEventListener('ended',function(){
        toggleSound(1);
    });
    audioObj.addEventListener('ratechange',function(){
        var _currentTime = currentTime
        //更改播放速度之后需要重新加载歌曲才能生效
        audioObj.src = curMusicItem.src;
        audioObj.play();
        audioObj.currentTime = _currentTime;
    })
    audioObj.addEventListener('timeupdate',function(){
        currentTime = audioObj.currentTime;
        localStorage.currentTime = currentTime;
        changeMusicProess();
    })
}

//音乐进度变换
function changeMusicProess(){
    var allTime = TimeStrbySecond(audioObj.duration);
    var curTime = TimeStrbySecond(audioObj.currentTime);
    var difference = audioObj.currentTime/audioObj.duration;
    $(".circle-range").style.left = difference*100+"%";
    $(".full-rectangle-range").style.width = difference*100+"%";
    $(".sound-range-curTime").innerHTML = curTime;
    $(".sound-range-endTime").innerHTML = allTime;
}

function TimeStrbySecond(s){
    var minutes = parseInt(s/60);
    var second = parseInt(s-(minutes*60));
    if(isNaN(minutes)||isNaN(second)){//偶尔会出现NAN闪过的现象
        minutes = 0;
        second = 0;
    }
    return (minutes<10?'0'+minutes:minutes)+":"+(second<10?'0'+second:second);
}

//切换歌曲
function toggleSound(direction){
    //切歌方向 越界判断
    if(direction==0){
        curMusicIndex--;
        if(curMusicIndex<0)
            curMusicIndex = MusicListLen-1;
    }else if(direction==1){
        curMusicIndex++;
        if(curMusicIndex==MusicListLen){
            curMusicIndex = 0;
        }
    }
    selectDataBase("myMusic",{'key':'id','value':+curMusicIndex},function(res) {
        curMusicItem = res[0];
        refreshMusicControls();
        // audioObj.autoPlay=true;
        audioObj.defaultPlaybackRate = 1;
        audioObj.src = curMusicItem.src;
        audioObj.play();
        saveStore();
    });
}



init();


