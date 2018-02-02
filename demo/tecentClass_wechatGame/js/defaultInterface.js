/**
 * Created by lenovo on 2018/2/2.
 */
/**
 * 获取元素函数
 * @param elem
 * @returns {Element}
 */
function $(elem){
    return document.querySelector(elem);
}

/**
 * 添加类名函数
 * @param elem
 * @param classTxt
 */
function addClass(elem,classTxt){
    elem.classList.add(classTxt);
}


/**
 * 删除类名函数
 * @param elem
 * @param classTxt
 */
function removeClass(elem,classTxt){
    elem.classList.remove(classTxt);
}

/**
 * 匹配类名函数
 * @param elem
 * @param classTxt
 */
function hasClass(elem,classTxt){
   return elem.classList.contains(classTxt);
}