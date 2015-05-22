/*
Kopi 1.0 Routing
*/

kopi.routes = {};
kopi.init = false;

function getQueryParams(qs) {
    var ar = qs.split('?');
    var query = {};
    if (ar.length > 1) {


        var ar2 = ar[1].split('&');

        for (var i in ar2) {
            var x = ar2[i].split('=');
            query[x[0]] = x[1];
        }
    }
    return query;
}

function Request(urlParam) {
    this.query = function(q) {
        return urlParam[q] ? urlParam[q] : null
    }
}
Kopi.prototype.route = new function() {
    this.get = function(hash, fn) {

        if (!kopi.routes[hash]) {
            kopi.routes[hash] = [];
        }
        kopi.routes[hash].push(fn);
    }
    this.change = function(hash) {
        var i = 0;
        kopi.navigate(hash, true);
        if (kopi.routes[hash]) {

            if (!kopi.init) {
                var roothash = '/';
                kopi.init = true;
                for (var i in kopi.routes[roothash]) {
                    var h = kopi.routes[roothash][i];
                    h && h(new Request(getQueryParams(document.location.hash)));
                }
            }
            for (var i in kopi.routes[hash]) {
                var h = kopi.routes[hash][i];				
                h && h(new Request(getQueryParams(document.location.hash)));
            }
        } else {
            var h = kopi.routes['/404'][0];
            h && h(new Request(getQueryParams(document.location.hash)));
        }

    }

}
var app = kopi.route;
