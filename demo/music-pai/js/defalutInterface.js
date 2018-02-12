/**
 * Created by lenovo on 2018/2/7.
 */
/**
 * 删除类名
 * @param elem
 * @param classTxt
 */
function removeClass(elem,classTxt){
    return elem.classList.remove(classTxt);
}
/**
 * 添加类名
 * @param elem
 * @param classTxt
 */
function addClass(elem,classTxt){
    return elem.classList.add(classTxt);
}
/**
 * 判断类名
 * @param elem
 * @param classTxt
 * @returns {boolean}
 */
function hasClass(elem,classTxt){
    return elem.classList.contains(classTxt);
}
/**
 * 切换类名
 * @param elem
 * @param classTxt
 */
function toggleClass(elem,classTxt){
    elem.classList.toggle(classTxt);
}
/**
 * 事件委托
 * @param Target
 * @param curTarget
 */
function eventHadler(event,matchClassTxt,callback){
    var Target = event.target;
    var curTarget = event.currentTarget;
    while(Target!=curTarget){
        if(hasClass(Target,matchClassTxt)){
            callback&&callback(Target);
            return true;
        }
        Target=Target.parentNode;
    }
}

/**
 * 选择器
 * @param selector
 * @returns {Element}
 */
function $(selector){
    return document.querySelector(selector);
}

/**
 * 弹出框
 * @param txt
 */
function toast(txt){
    var div = document.createElement('div');
    div.className = 'toast';
    div.innerText = txt;
    document.body.appendChild(div);
    setTimeout(()=>{
        toggleClass(div,'fadeIn');
    },500);
    setTimeout(()=>{
        toggleClass(div,'fadeOut');
    },3000);
    setTimeout(()=>{
        div.parentNode.removeChild(div);
    },3500);
}

/**
 * 获取ooffsetLeft直至顶层元素
 * @param target
 * @returns {Number|number}
 */
function getOffsetLeft(target){
    var countLeft = target.offsetLeft;
    while(target.offsetParent!=null){
        countLeft += target.offsetParent.offsetLeft;
        target = target.offsetParent;
    }
    return countLeft;
}