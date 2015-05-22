/*
Kopi 1.0 Module Management
*/

Kopi.prototype.module=new function(){
	this.list=[];
	this.current='';
	this.register=function(module){
		this.current=module;
		this.list.push(module);
	}

}