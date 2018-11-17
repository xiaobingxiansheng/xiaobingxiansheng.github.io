function animateStart(section){
  var animateElem = $(section).find('[animate]');
  for(var item of animateElem) {
    var jq_item = $(item);
    
    jq_item.addClass( jq_item.attr('class') )  
    
    
  }
}