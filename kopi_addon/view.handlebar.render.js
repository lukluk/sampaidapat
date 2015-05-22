var Render = function (html) {
    this.html=function(){
        return html;
    }
    this.to = function (sel) {        
        for (var n in config.lang) {
            var ln = config.lang[n];

           // html = S(html).replaceAll(n, ln).s;
            html = S(html).replaceAll(ln+'"', n+'"').s;
            
            html = S(html).replaceAll(ln+"'", n+"'").s;
            html = S(html).replaceAll(ln+",", n+",").s;

        }
        $(sel).html(html);
        kopi.event.trigger('afterRender');
        kopi.event.trigger(currentmodel+'.view',new Request(getQueryParams(document.location.hash)));
    }
}

Kopi.prototype.render = function (path, data) {
    var strReturn = null;
    path && jQuery.ajax({
        url: 'view/' + path,
        success: function (html) {
            strReturn = html;
        },
        async: false
    });


    var result = strReturn && Handlebars.compile(strReturn);
    if(!result){
        return new Render('Cannot open '+path);
    }
    return result && new Render(result(data));
}