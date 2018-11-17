function animateStart(section){
  var animateElem = $(section).find('[animate]');
  for(var item of animateElem) {
    var jq_item = $(item);
    item.addClass(item.attr('class')) 
  }
}