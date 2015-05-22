/*
Kopi 1.0 Event Manager
*/

function hashChanged() {
    var hash = location.hash.replace("#", "");
    if (hash.indexOf('?')) {
        hash = hash.split('?')[0];
    }
    if (hash == '') {
        hash = '/';
    }
    if(hash=='/'){
        kopi.init=true;
    }
    kopi.route.change(hash);
}
Kopi.prototype.event = new function() {
    this.events = {};
    this.add = function(name, fn) {        
        if(!this.events[name]){
            this.events[name]=[];
        }
        this.events[name].push(fn);
    }
    this.trigger = function(name,param,callback,onNotFound) {
		console.log("trigger "+name);
        var found=false;

        for(var event in this.events[name]){
            typeof this.events[name][event] == 'function' && this.events[name][event](param,callback);    
            found=true;
        }
        if(!found){
            if(typeof param=='function'){
                param && param();
            }else
            if(typeof onNotFound=='function'){

                onNotFound && onNotFound();
            }
        }
        
    }
}

kopi.event.add('kopi.ready', function() {
    typeof kopi.event.events['preload'][0] == 'function' && kopi.event.events['preload'][0]();
    window.addEventListener("hashchange", function() {
        hashChanged();  
    }, false);
    hashChanged();

})
$(document).ready(function(){
	kopi.event.trigger('kopi.ready');

})