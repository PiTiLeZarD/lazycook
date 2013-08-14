
var scrollBottom = function( $elt ) {
  var elt = $elt.get(0);
  elt.scrollTop = elt.scrollHeight - $elt.height();
}
