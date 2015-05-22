/*
Kopi 1.0 Navigation

*/

kopi.history=[];
kopi.history.push('/');
Kopi.prototype.navigate=function(to,noredirect){
	var i=0;
	var temp=[];
	$('#message').html('')
	kopi.history.push(to);
	while( kopi.history[i]!=to && i<kopi.history.length ){
		console.log(kopi.history[i]);
		temp.push(kopi.history[i]);
		i++;
	}
	if(to=='back'){
		if(temp.length){		
			temp.pop();
			to=temp[temp.length-1];
		}
	}else{
		temp.push(to);
	}
	kopi.history=temp;
	if(noredirect){
		console.log('nav ->',to);
	}else{
		window.location=window.location.protocol +'//'+ window.location.hostname +':'+window.location.port +'/#/'+to;
	}
}
