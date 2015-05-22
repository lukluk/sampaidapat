
Kopi.prototype.api = new function() {
    this.url = '';
    this.module = function(model, where) {
        var wh = where ? '?where=' + JSON.stringify(where) : '';
        var result = null;
        $.ajax({
            type: 'GET',
            url: this.url + '/' + model + wh,
            dataType: 'json',
            success: function(data) {
                result = data;
            },
            async: false
        });
        return result;
    }
    this.connect = function(url) {
        this.url = url;
        $.get(url,function(data){
                
        }).error(function(){
            //sweetAlert && sweetAlert("Networking Problem", "connections to API server failed", "error");
            window.location="/#/505"
            
        })
    }
    
}
