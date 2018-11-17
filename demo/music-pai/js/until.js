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
 * 两个类名之间切换
 * @param elem 
 * @param removeArray 
 * @param replaceArray 
 */
function toggleClasses(elem, removeArray, replaceArray){
    elem.classList.replace(removeArray, replaceArray)
}

/**
 * 事件委托
 * @param Target
 * @param curTarget
 */
function eventHandle(event, matchClassTxt, callback){
    var Target = event.target;
    var curTarget = event.currentTarget;
    while(Target != curTarget){
        if(hasClass(Target, matchClassTxt)){
            callback&&callback(Target);
            return true;
        }
        Target = Target.parentNode;
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

/**
 * 毫秒转音乐播放时间
 * @param {number} s 
 */
function TimeStrbySecond(s){
    var minutes = parseInt(s/60);
    var second = parseInt(s-(minutes*60));
    if(isNaN(minutes)||isNaN(second)){//偶尔会出现NAN闪过的现象
        minutes = 0;
        second = 0;
    }
    return (minutes<10?'0'+minutes:minutes)+":"+(second<10?'0'+second:second);
}

function toggleIndex(fx, index, Max){
    //切歌方向 越界判断
    if(fx == 0){
        index--;
        if(index<0)
            index = Max-1;
    }else if(fx == 1){
        index++;
        if(index == Max){
            index = 0;
        }
    }
    return index;
}