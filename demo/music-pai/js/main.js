/**
 * Created by lenovo on 2018/2/6.
 */
var audioObj = null;
// 音乐列表容器
var musicListContainer = $(".music-list-container");
// 音乐播放页
var musicSoundControl = $(".music-listenning");
// 音乐播放控件
var musicControl = $("footer");
//1顺序播放 2随机播放
// var StartingType = 1;
//拖拽参数
// var moving = false;

// 音乐总数
var MusicListLen = 0;
var index = 0;
var curMusicItem = null;
var curMusicIndex = typeof localStorage.audioId!='undefined'?localStorage.audioId:0;
var currentTime = typeof localStorage.currentTime!='undefined'?localStorage.currentTime:0;

/**
 * 获取音乐列表
 */
function getMusicListByInterface(){
    var array = [];
    return new Promise((resolve)=>{
        openIndexedDataBase("myMusic",'1.0',() => {
            //获取后端数据
            for(var i=0;i<dataMessage.length;i++){
                array.push(dataMessage[i]);
            }
            // 加载到数据库
            pushIntoDataBase("myMusic", array);
            // 查询本地数据库
            selectDataBase("myMusic", null, (res,len) => { resolve({res,len}); });
        });
    })

}

/**
 * 生成音乐列表
 */
function generateMusicItem(array){
    musicListContainer.innerHTML = getMusicTemplete(array);
}


/**
 * 重新渲染DOM 以及 事件
 */
function refreshMusicControls(){
    // 重新渲染
    musicControl.innerHTML = getMusicControlsTemplete(curMusicItem);
    musicSoundControl.innerHTML = getMusicSoundControlsTemplete(curMusicItem);
    //播放页事件
    musicSoundControlEvent();
}

/**
 * 初始化
 */
function init() {
    // 获取歌曲数据
    getMusicListByInterface()
    .then((data)=>{
        // 生成音频控件
        initAudio();
        // 生成音乐列表
        generateMusicItem(data.res);
        // 刷新音乐数量
        refreshSoundLen(data.len)
    });
}

function refreshSoundLen(sound_len) {
    MusicListLen = sound_len;//更改列表长度
    $(".sound-num").innerHTML = sound_len;
}

/**
 * 初始化音频对象
 */
function initAudio(){
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
 * 切换icon状态（暂停/播放）
 */
function controlsChangeClass(isToggle){
        if(isToggle){
            toggleClasses($(".music-control-icon"), "icon-start", "icon-pause");
            addClass(musicSoundControl,"listenning");
        }else{
            toggleClasses($(".music-control-icon"), "icon-pause", "icon-start");
            removeClass(musicSoundControl,"listenning");
        }
}

/**
 * 播放页事件
 */
function musicSoundControlEvent(){
    // 播放返回动画
    $('.music-listenning-header .icon-back').addEventListener('touchend', function(e){
        toggleClasses(musicSoundControl, 'fadeIn', 'fadeOut');
        setTimeout(()=>{ toggleClasses(musicSoundControl, 'fadeOut', 'dis-no') }, 300);
    });
    //播放控件
    $('.sound-controls .icon-soundState').addEventListener('touchend', controlsChangeState);
    $('.sound-controls .icon-soundNext').addEventListener('touchend', ()=>{toggleSound(1);});
    $('.sound-controls .icon-soundforWard').addEventListener('touchend', ()=>{toggleSound(0);});
    $('.sound-range-comment').addEventListener('touchmove', (e)=>{
        //获取拖拽信息，并更新reac
        var ProcessParamerObj = getProcessParamerByRangEvent(e.changedTouches[0].clientX);
        $(".sound-range-curTime").innerHTML = TimeStrbySecond(ProcessParamerObj.currentTime);
        $(".circle-range").style.left = ProcessParamerObj.currentLeft*100+"%";
        $(".full-rectangle-range").style.width = ProcessParamerObj.currentLeft*100+"%";
    });
    $('.sound-range-comment').addEventListener('touchend', (e)=>{
        // 因为重新选择了进度，所以要重新暂停启动
        audioObj.pause();
        audioObj.currentTime = getProcessParamerByRangEvent(e.changedTouches[0].clientX).currentTime;
        audioObj.play();
    });
    //鬼畜模式
    $('.Kichiku-kedu').addEventListener('touchend', (e)=>{
        // 总长
        var allClientWidth = e.target.clientWidth;
        // 半长
        var halfClientWidth = allClientWidth/2;
        // 相对位置
        var relativePosition = e.changedTouches[0].clientX-getOffsetLeft(e.target);
        // 相对位置占总长比
        var curPosition = relativePosition / allClientWidth;
        //相对位置占半长比
        var curHalfPosition = relativePosition / halfClientWidth;
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
    musicListContainer.addEventListener('touchend',function(event){
        eventHandle(event, "music-list-item", function(e){
            curMusicIndex = +e.getAttribute("data-id");
            selectDataBase("myMusic",{'key':'id','value':+curMusicIndex},function(res){
                curMusicItem = res[0];
                refreshMusicControls();
                audioObj.autoPlay = true;
                audioObj.src = curMusicItem.src;
                audioObj.play();
                localStorage.audioId = curMusicIndex;
            })
        })
    });
    musicControl.addEventListener('touchend',function(e){
        //如果不触发播放按钮，则打开播放页
        if(!eventHandle(e,"music-control-circle", controlsChangeState)){
            removeClass(musicSoundControl,"dis-no");
            setTimeout(()=>{
                addClass(musicSoundControl,"fadeIn");
            },100);
        }
    });
    audioObj.addEventListener('playing', ()=>{ controlsChangeClass(1); });
    audioObj.addEventListener('pause', ()=>{ controlsChangeClass(0); });
    audioObj.addEventListener('ended',function(){ toggleSound(1);});
    audioObj.addEventListener('ratechange',function(){
        var _currentTime = currentTime
        //更改播放速度之后需要重新加载歌曲才能生效
        audioObj.src = curMusicItem.src;
        audioObj.play();
        audioObj.currentTime = _currentTime;
    })
    audioObj.addEventListener('timeupdate',function(){
        // 更新音乐进度数据
        currentTime = audioObj.currentTime;
        localStorage.currentTime = currentTime;
        // 更新渲染音乐DOM
        changeMusicProess();
    })
}

//音乐进度变换
function changeMusicProess(){
    var allTimeTimeStr = TimeStrbySecond(audioObj.duration);
    var curTimeTimeStr = TimeStrbySecond(audioObj.currentTime);
    var difference = audioObj.currentTime / audioObj.duration;
    var difPercent = difference * 100;

    $(".circle-range").style.left = difPercent +"%";
    $(".full-rectangle-range").style.width = difPercent +"%";
    $(".sound-range-curTime").innerHTML = curTimeTimeStr;
    $(".sound-range-endTime").innerHTML = allTimeTimeStr;
}

//切换歌曲
function toggleSound(direction){
    curMusicIndex = toggleIndex(direction, curMusicIndex, MusicListLen);
    selectDataBase("myMusic", {'key':'id','value':+curMusicIndex}, function(res) {
        curMusicItem = res[0];
        refreshMusicControls();
        // audioObj.autoPlay=true;
        audioObj.defaultPlaybackRate = 1;
        audioObj.src = curMusicItem.src;
        audioObj.play();
        localStorage.audioId = curMusicIndex;
    });
}

init();


