/**
 * Created by lenovo on 2018/2/1.
 */
'use strict';

//tools
function $(elem){
    return document.querySelector(elem);
}
function addClass(elem,classTxt){
    elem.classList.add(classTxt);
}
setTimeout( ()=>{
    addClass($(".wechat-page"),"selecting");
},3000);
