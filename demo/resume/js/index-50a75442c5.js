var animating = null;
var wheelAnimate = null;

function getPageLenFormDom() {
  return document.querySelectorAll('.resume-page-box>section').length - 1;
}


TODO:// 这个滚动计数器还没用使用，是当时用来计数用的。
  var wheelCounter = (function () {
    var wheelcount = 0;
    var __timerCounter = function () {
      var precount = wheelcount;
      setTimeout(() => {
        // 如果没有在按时内更改就归零
        if (precount == wheelcount) {
          wheelcount = 0;
        }
      }, 1000)
    }
    return {
      addCounter() {
        if (wheelcount <= 3) {
          wheelcount++
        }
        __timerCounter()
        return wheelcount;
      },
      refreshCounter() {
        wheelcount = 0;
      },
      getCounter() {
        return wheelcount;
      }
    }
  })();


var indexController = (function () {
  var index = 0;
  var end = getPageLenFormDom();
  return {
    getIndex() {
      return index;
    },
    changeIndex(fx) {
      var preIndex = index;
      // 方向判断
      if (fx) {
        // 边界判断
        if (index < end) {
          index++;
        }
      } else {
        if (index > 0) {
          index--;
        }
      }
      return {
        index,
        preIndex
      }
    }
  }
})();



function getTranslateYfromIndex(index) {
  return 'translateY(' + (-index) + '%)';
}

function wheel() {
  var delta = 0;
  if (!event) event = window.event;
  if (event.wheelDelta) { // IE、Chrome只能在这里取
    delta = event.wheelDelta / 120;
    if (window.opera) delta = -delta // Opera为正负相反的，需要矫正一致性
  } else if (event.detail) {
    delta = -event.detail / 3;
  }
  if (wheelAnimate === null) {
    wheelAnimate = setTimeout(() => {
      handle(delta);
    }, 100);
  }
}

function handle(delta) {
  // 变更index
  var isAddOrReduce = !(delta > 0);
  var {
    index,
    preIndex
  } = indexController.changeIndex(isAddOrReduce);
  console.log(index)
  // 如果在当前位置就不需要移动了
  if (index == preIndex) {
    wheelAnimate = null;
    return;
  }
  moveAnimatePage(index, preIndex).then(() => {
    console.log("完成！")
    wheelAnimate = null;
    pageAnimateStart(getElemFromPageNum(index))
  })
}

function moveAnimatePage(end, start) {
  return new Promise((resolve, reject) => {
    var pageContainer = document.querySelector('.resume-page-box');
    var fx = end > start;
    var startY = start * 100;
    var endY = end * 100;
    var speed = 2;
    animating = setInterval(() => {
      // 累加
      startY = fx ? startY + speed : startY - speed;
      var isNeedAnimate = fx ? (startY < endY) : (startY > endY);
      if (isNeedAnimate) {
        pageContainer.style.transform = getTranslateYfromIndex(startY);
      } else {
        pageContainer.style.transform = getTranslateYfromIndex(endY);
        resolve()
        clearAnimateTimer();
      }
    }, 60 / 1000)

    var clearAnimateTimer = function () {
      clearInterval(animating);
    }
  })
}


function getElemFromPageNum(num) {
  return $(`.resume-page:eq(${num})`)[0];
}




// 一个开始就有动画
$(() => {
  pageAnimateStart(getElemFromPageNum(0))
  resumeNameAnimate();
  touchScrollPage();
  window.onmousewheel = wheel;
  
})

function touchScrollPage(){
  var onTouch = false;
  var touchstartY = 0; 
  var touchendY = 0; 
  var diffTouch = 0;
  document.addEventListener('touchstart', function(e){
    onTouch = true;
    touchstartY = e.touches[0].clientY;
    
  })
  document.addEventListener('touchend', function(e){
    touchendY = e.changedTouches[0].clientY;
    diffTouch = touchstartY - touchendY;
    let scrollDir = +(diffTouch<30);
    handle(scrollDir);
    initConfig();
  })

  var initConfig = function(){
    onTouch = false;
    touchstartY = 0; 
    touchendY = 0; 
    diffTouch = 0;
  }

  var disTip = function(x, y){
    var tip = document.querySelector(".resume-tip");
    tip.style.cssText = `left:${x};top:${y}`;
  }
}