/**
 * Created by lenovo on 2018/2/1.
 */
'use strict';

let score = 0;
let step = 0;
const firstPage = $(".first-page");
const wechatPage = $(".wechat-page");
const selectList = $(".select-list");

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
function getSelectorMessage(str,score){
    const template = `
        <div class="message-item message-item-right js-select-item" data-score="${score}">
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
    $(".chat-list").appendChild(dom);
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
                score += +target.getAttribute("data-score");
                appendDomMessage('right',target.innerText);
                nextStep();
                return ;
            }
            target = target.parentNode;
        }
    });
}
/**
 * 选择列表内容切换
 */
function changeSelector(){
    const currentStepMessage = data.messages[step].right;
    let html = '';
    currentStepMessage.forEach((msg)=>{
        html+= getSelectorMessage(msg.text,msg.score);
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
        oneStep();
    }else{
        alert(score);
    }
}

/**
 * 每一步所需做的事情
 */
function oneStep(){
    const curMessage = data.messages[step];
    setTimeout(()=>{
        appendDomMessage('left',curMessage.left);
        toggleSelector(true);
    },300);
    changeSelector();
}

/**
 * 初始化函数
 */
function init(){
    event();
}


init();
