"use strict";

let ajaxGet = new XMLHttpRequest();

ajaxGet.addEventListener("load", function(){
	
	
  if(ajaxGet.status >= 200 && ajaxGet.status < 300 && ajaxGet.readyState === 4){
   // document.getElementById("output").value = ajaxGet.responseText;
	//*************************
		let remove = document.getElementById("output");
		if(remove.hasChildNodes()){
			while (remove.hasChildNodes()) {   
			remove.removeChild(remove.firstChild);
			}
		}
		
		let new_node = document.createElement("UL");
		for(let linumber = 0; linumber < JSON.parse(this.responseText).length; linumber++){
			
			let individual = document.createTextNode(JSON.parse(this.responseText)[linumber]);
			let new_li = document.createElement("LI");
			let new_br = document.createElement("br");
			new_li.appendChild(individual);
			new_node.appendChild(new_li);
			new_node.appendChild(new_br);
			
		}
		
		document.getElementById("output").appendChild(new_node);
		console.log(ajaxGet.status);
	
	//*********************
  }
})

document.getElementById("translate").addEventListener("click", function(){
  ajaxGet.open("post", "/translate?text=" + document.getElementById("text").value + "&orig=" + document.getElementById("from").value + "&trans=" + document.getElementById("to").value);
  console.log("/translate?text=" + document.getElementById("text").value + "&orig=" + document.getElementById("from").value + "&trans=" + document.getElementById("to").value);
  ajaxGet.send();
});
