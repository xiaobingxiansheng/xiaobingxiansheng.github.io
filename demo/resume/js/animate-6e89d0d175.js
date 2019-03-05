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
  const text = `我是一个前端学习者，曾就职于某特科技有限公司，负责公众号应用开发，拥有1年的项目经验。目前正在学习大厂React框架经验，在业外能够尽力去提升和记录自己
  ，本人了解ES6，了解Gulp、Webpack等自动化构建工具，本页面用于展示和记录自己的学习，目前处于初步阶段，期待未来有更多出彩的地方来丰富这个页面，技术使用原生JavaScript和HTML5+CSS3。 感谢！`
  var index = 0;

  setTimeout(function(){
    var randSpeed = Math.floor(Math.random() * 20) + 70;
    var splitText = text.substring(0, index++);
    console.log(splitText);
    $(".resume-job-inline").html(splitText);

    if(splitText.length < text.length){
      setTimeout(arguments.callee, randSpeed);
    }
  }, 70)
}

