/**
 * Created by lenovo on 2018/2/1.
 */
'use strict';

let score = 0;
let step = 0;
let scrollBottomTimitor = null;
let scrollBottomTimerNum = 0;
let curPrizeTips = '';
let isPrizereviced = false;
let isSee = false;
const firstPage = $(".first-page");
const wechatPage = $(".wechat-page");
const selectList = $(".select-list");
const wechatTitle = $("#wechat-title");
const chatList = $(".chat-list");
const ResultElem = $(".showResult");
const showResultPrizeButton = $("#showResult-prize-button");
const showPrize = $('.showPrize');
/**
 * 填入字符串模板获取DOM
 * @param str
 */

function getDomByStr(str){
    const div = document.createElement("div");
    div.innerHTML = str;
    return div.children[0];
}

/**
 * 生成字符串模板并获取DOM
 * @param side
 * @param str
 * @returns {*}
 */
function getDomMessage(side,str){
    const template = `
        <div class="message-item message-item-${side}">
            <img class="avatar" src="${side==='left'?LEFT_IMG:RIGHT_IMG}" alt="这是一个头像">
            <div class="message-bubble">
                <p class="message-bubble-txt">
                    ${str}
                </p>
            </div>
        </div>
    `;
    return getDomByStr(template);
}

/**
 * 获取选择列表HTML字符串
 * @param str
 * @param score
 * @returns {string}
 */
function getSelectorMessage(str,index,score){
    const template = `
        <div class="message-item message-item-right js-select-item" data-score="${score}" data-index="${index}">
            <img class="avatar" src="${RIGHT_IMG}" alt="这是一个头像">
            <div class="message-bubble">
                <p class="message-bubble-txt">
                    ${str}
                </p>
            </div>
        </div>
    `;
    return template;
}

/**
 * 添加聊天内容到页面
 * @param side
 * @param str
 */
function appendDomMessage(side,str){
    let dom = getDomMessage(side,str);
    chatList.appendChild(dom);
    scrollBottom();
    if(side=='left'){//如果是左边信息就发出声音
        MakeWechatSound();
    }
}

/**
 * 正在输入中..
 * @param callback
 */
function timerDomMessage(callback,timeout){
    wechatTitle.innerHTML = "对方正在输入..";
    setTimeout(()=>{
        wechatTitle.innerHTML = WECHAT_TITLE;
        callback&&callback();
},timeout);
}


/**
 * 置底动画
 */
function scrollBottom(timer){
     typeof timer!="undefined"? (function(){
         scrollBottomTimitor = setInterval(()=>{//持续的让他置于底下
           chatList.scrollTop = chatList.scrollHeight;
           scrollBottomTimerNum+=100;
           if(scrollBottomTimerNum>=timer){//当时间到达就停止
               //清零
               scrollBottomTimerNum = 0;
               clearInterval(scrollBottomTimitor);
               scrollBottomTimitor = null;
           }
         },30);
     })():chatList.scrollTop = chatList.scrollHeight;
}


/**
 * 用来存放所有的事件
 */
function event(){
    /**
     * 首页动画
     */
    firstPage.addEventListener('touchend',()=>{
        addClass(firstPage,"fadeOut");
        setTimeout( ()=>{
            addClass(firstPage,"hide");
            oneStep();
        },500);
    },false);

    /**
     * 事件委托
     */
    selectList.addEventListener('touchend',(e)=>{
        let target = e.target;
        let currentTarget = e.currentTarget;
        while(target!==currentTarget){
            if(hasClass(target,"js-select-item")){
                let curScore = +target.getAttribute("data-score");
                let curIndex = +target.getAttribute("data-index");
                score += curScore;
                appendDomMessage('right',target.innerText);
                timerDomMessage(()=> {
                    appendDomMessage('left', data.messages[step].right[curIndex].say);
                    nextStep();
                },700);
                return ;
            }
            target = target.parentNode;
        }
    });

    /**
     * 奖品打开
     */
    showResultPrizeButton.addEventListener("touchend",(e)=>{
        if(isPrizereviced){//是否已经打开过了
            removeClass(showPrize,'hide');
            removeClass(showPrize,'fadeOut');

        }else{
            let result = data.result;
            let prizelevel;
            let prizeRadomObj;
            //判断分数并获取级别
            for(var index in result){
                if(result[index].score<=score){
                    prizelevel = result[index].prizeLevel;
                    break;
                }
            }
            prizeRadomObj = getRadomPrizeObjByLevel(prizelevel);
            curPrizeTips = prizeRadomObj.tips;
            appendDomMessage('left',curPrizeTips);
            appendPrizeDom(prizeRadomObj);
            removeClass(showPrize,'hide');
            togglePrizeSwitch();
        }
    });

    /**
     * 奖品点击
     */
    showPrize.addEventListener('touchend',(e)=>{
        addClass(showPrize,'fadeOut');
        setTimeout(()=>{
            addClass(showPrize,'hide');
        },300)
    });

    /**
     * 重新开始
     */
    $("#rePlayBtn").addEventListener('touchend',(e)=>{
        window.location.href = window.location.href;
    });

    /**
     * 透明窗体
     */
    $("#seeLeftMessage").addEventListener("touchend",(e)=>{
        isSee = !isSee;
        if(isSee){
            addClass($("#seeLeftMessage"),"icon-eye");
            addClass($(".showResult-div"),'opacityHalf');
            removeClass($("#seeLeftMessage"),"icon-noeye");
        }else{
            addClass($("#seeLeftMessage"),"icon-noeye");
            removeClass($(".showResult-div"),'opacityHalf');
            removeClass($("#seeLeftMessage"),"icon-eye");
        }
    });
    /**
     * 关于这款软件
     */
    $("#wechat-about-btn").addEventListener("touchend",(e)=>{
        removeClass($(".aboutPage"),"hide");
    });
    $(".aboutPage").addEventListener("touchend",(e)=>{
        addClass($(".aboutPage"),"hide");
    })
}


/**
 *发出声音
 */
function MakeWechatSound(){
    let audio = document.getElementById("wechat_audio");
    audio.play();
}

/**
 * 切换奖品开关
 */
function togglePrizeSwitch(){
    isPrizereviced = !isPrizereviced;
}

/**
 * 根据级别获取随机奖品
 * @param level
 * @returns {*}
 */
function getRadomPrizeObjByLevel(level){
    let resultPrize = data.prize[level];
    return resultPrize[ Math.floor( Math.random()*resultPrize.length ) ];
}

function appendPrizeDom(prizeObj){
    let src = prizeObj.src;
    let type = prizeObj.type;
    let sourceObj = null;
    if(type=='img'){
        sourceObj = document.createElement('img');
        sourceObj.src = src;
        showPrize.appendChild(sourceObj);
    }

}
/**
 * 选择列表内容切换
 */
function changeSelector(){
    const currentStepMessage = data.messages[step].right;
    let html = '';
    currentStepMessage.forEach((msg,index)=>{
        html+= getSelectorMessage(msg.text,index,msg.score);
    });
    selectList.innerHTML = html;
}

/**
 * 选择列表切换动画
 * @param isShow
 */
function toggleSelector(isShow){
    if(isShow){
        addClass(wechatPage,"selecting");
    }else{
        removeClass(wechatPage,"selecting");
    }
}

/**
 * 下一步函数
 */
function nextStep(){
    step+=1;
    if(step<data.messages.length){
        toggleSelector(false);
        scrollBottom()
        oneStep();
    }else{
        showResult();
    }
}

/**
 * 每一步所需做的事情
 */
function oneStep(){
    const curMessage = data.messages[step];
    timerDomMessage(()=> {
        appendDomMessage('left',curMessage.left);
        scrollBottom(500);
        toggleSelector(true);
    },700);
    changeSelector();
}

/**
 * 成功展示
 */
function showResult(){
    removeClass(ResultElem,'hide');
    setTimeout(()=>{
        addClass(ResultElem,'fadeIn');
    },100);
}

/**
 * 初始化函数
 */
function init(){
    event();
}


init();
