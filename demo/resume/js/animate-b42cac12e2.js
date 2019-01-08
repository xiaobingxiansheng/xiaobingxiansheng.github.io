function pageAnimateStart(section){
  var animateElem = $(section).find('[animate]');
  for(let item of animateElem) {
    var jq_item = $(item);
    animateTimer(jq_item)
  }
}

function animateTimer(jq_item){
  var addClass = jq_item.attr('animate') ;
  jq_item.addClass([addClass, 'animated'])  
  return new Promise((resolve,rejct)=>{
    setTimeout(()=>{
      jq_item.removeClass([addClass, 'animated'])
      resolve();
    }, 2000)
  })
}


function resumeNameAnimate(){
  var _resumeNameTimer = (callback, speed)=>{
    setTimeout(()=>{
      setTimeout(arguments.callee, speed);
    }, speed)
  };
  _resumeNameTimer(function(){
    console.log(1);
  }, 70)
}