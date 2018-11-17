function animateStart(section){
  var animateElem = $(section).find('[animate]');
  for(let item of animateElem) {
    var jq_item = $(item);
    animateTimer(jq_item).then(function(){
      
    })
  }
}

function animateTimer(jq_item){
  var addClass = jq_item.attr('animate') ;
  jq_item.addClass(addClass, 'animated')  
  return Promise((resolve,rejct)=>{
    setTimeout(()=>{
      jq_item.removeClass(addClass, 'animated')
      resolve();
    }, 1000)
  })
}