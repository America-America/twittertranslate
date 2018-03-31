"use strict"
//document.getElementById("christmas").addEventListener("click", count_christmas);
let count_christmas = function(){
	
	
	let d1 = new Date(); //"now"
	let d2 = new Date("2018/12/25")  // some date
	let diff = Math.abs(d2-d1);  // difference in milliseconds
	
function dhm(t){
    let cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return d;
  //return [d, pad(h), pad(m)].join(':');
}

	
	
	let new_node = document.createElement("h1");
	let result_date = document.createTextNode(dhm( diff)+" days left!");
	new_node.appendChild(result_date);
	document.getElementById("thismany").appendChild(new_node)
	
};
