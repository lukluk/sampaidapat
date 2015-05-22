var config={};
if(en){
config.lang=en;
}else{
    config.lang={};
}
app.get('/404', function(req) {
	kopi.render('404.html').to('body');    	
});
app.get('/505', function(req) {
	kopi.render('505.html').to('body');    	
});
var currentmodel='search';
