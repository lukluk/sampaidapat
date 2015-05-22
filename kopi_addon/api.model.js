function Model(name, zip) {
    this.data = null;

    this.clearCache = function() {
        for (var key in localStorage) {
            if (key.indexOf('tb') >= 0) {
                localStorage.removeItem(key);
            }
        }
    }
    this.call = function(controller, option, callback, index) {
        var self = this;
        var render = false;
        if (zip) {
            if (name.indexOf('get') >= 0 && localStorage.getItem('tb' + name + controller + JSON.stringify(option)) != null) {
                render = true;
                callback && callback(JSON.parse(localStorage.getItem(name + controller + JSON.stringify(option))));
            }

            $.get(kopi.api.url + '/' + name + '/' + controller, option, function(data) {
                var data = JSON.parse(pako.inflate(data, {
                    to: 'string'
                }));
                localStorage.setItem(name + controller + JSON.stringify(option), JSON.stringify(data));
                !render && callback && callback(data);
            }).error(function(err) {
                console.log(err.responseJSON);
            })

        } else {
            if (name.indexOf('get') >= 0 && localStorage.getItem('tb' + name + controller + JSON.stringify(option)) != null) {
                render = true;
                callback && callback(JSON.parse(localStorage.getItem('tb' + name + controller + JSON.stringify(option))));
            }

            $.getJSON(kopi.api.url + '/' + name + '/' + controller, option, function(data) {
                localStorage.setItem('tb' + name + controller + JSON.stringify(option), JSON.stringify(data));
                !render && callback && callback(data);
            }).error(function(err) {
                err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
            })
        }
    }
    this.find = function(option, callback, index) {
        var self = this;
        var param = ''
        var render = false;
        var controller = 'find';
        for (var key in option) {
            if (key == 'sort' || key == 'limit' || key == 'where' || key == 'skip' || key == 'callback')
                if (typeof option[key] == "object") {
                    var val = JSON.stringify(option[key])
                } else {
                    var val = option[key];
                }
            param += '&' + key + '=' + val;
        }
        param = param.substring(1, param.length);
        param = param.replace(new RegExp('"true"', 'g'), "true");
        console.log('param', param);
        param = param.replace(new RegExp('"false"', 'g'), "false");
        param = param.replace(new RegExp("'", 'g'), '"');
        if (zip) {
            //			if (localStorage.getItem('tb'+name + controller + JSON.stringify(option)) != null) {
            //				render=true;
            //				callback && callback(JSON.parse(localStorage.getItem('tb'+name + controller + JSON.stringify(option))));
            //			}			
            $.get(kopi.api.url + '/' + name + '/?' + param, function(data) {
                var data = JSON.parse(pako.inflate(data, {
                    to: 'string'
                }));
                if (index) {
                    self.data = data[0];
                    localStorage.setItem('tb' + name + controller + JSON.stringify(option), JSON.stringify(self.data));
                    !render && callback && data.length && callback(data[0]);
                } else {
                    self.data = data;
                    localStorage.setItem('tb' + name + controller + JSON.stringify(option), JSON.stringify(self.data));
                    !render && callback && callback(data);
                }
            }).error(function(err) {
                console.log("ERR", err)
                err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
            })

        } else {
            //			if (localStorage.getItem('tb'+name + controller + JSON.stringify(option)) != null) {
            //				render=true;
            //				callback && callback(JSON.parse(localStorage.getItem('tb'+name + controller + JSON.stringify(option))));
            //			}			
            $.getJSON(kopi.api.url + '/' + name + '/?' + param, function(data) {
                if (index) {
                    self.data = data[0];
                    localStorage.setItem('tb' + name + controller + JSON.stringify(option), JSON.stringify(self.data));
                    !render && callback && data.length && callback(data[0]);
                } else {
                    self.data = data;
                    localStorage.setItem('tb' + name + controller + JSON.stringify(option), JSON.stringify(self.data));
                    !render && callback && callback(data);
                }
            }).error(function(err) {
                console.log("ERR", err)
                err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
            })
        }
    }
    this.findOne = function(option, callback) {
        this.find(option, callback, true);
    }
    this.insert = function(option, callback, errorcb) {
        $.getJSON(kopi.api.url + '/' + name + '/create', option, function(data) {
            if (currentuser && name!='officerlog')
                log.call('report', {
                    action: 'insert '+name,
                    param: JSON.stringify(option),
                    user: currentuser
                })

            callback && callback(data);
        }).error(function(err) {
            console.log(err.responseJSON);
            errorcb && errorcb(err.responseJSON)
            err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
        })
    }
    this.destroy = function(id, callback) {

        $.getJSON(kopi.api.url + '/' + name + '/destroy/' + id, function(data) {
            if (currentuser && name!='officerlog')
                log.call('report', {
                    action: 'destroy '+name,
                    param: JSON.stringify({
                        id: id
                    }),
                    user: currentuser
                })
            callback && callback(data);
        }).error(function(err) {
            console.log(err.responseJSON);
            err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
        })
    }
    this.delete = function(option, callback) {
        this.findOne(option, function(data) {
            $.getJSON(kopi.api.url + '/' + name + '/destroy/' + data.id, function(data) {
                callback && callback(data);
                if (currentuser && name!='officerlog')
                    log.call('report', {
                        action: 'delete '+name,
                        param: JSON.stringify(option),
                        user: currentuser
                    })
            }).error(function(err) {
                console.log(err.responseJSON);
                err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
            })
        })
        
    }
    this.updateById = function(id, param, callback) {
        this.clearCache();
        $.getJSON(kopi.api.url + '/' + name + '/update/' + id + '/', param, function(data) {
            callback && callback(data);
        }).error(function(err) {
            err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
        })
    }
    this.update = function(option, callback) {
        var th = this;
        this.find(option, function(datas) {
            th.clearCache();
            var param = {};
            for (var key in option) {
                if (key != 'where')
                    param[key] = option[key];
            }

            for (var n in datas) {
                var data = datas[n];
                $.getJSON(kopi.api.url + '/' + name + '/update/' + data.id + '/', param, function(data) {
                    if (currentuser && name!='officerlog')
                        log.call('report', {
                            action: 'update '+name,
                            param: JSON.stringify(option),
                            user: currentuser
                        })
                    callback && callback(data);
                }).error(function(err) {

                    err.responseJSON && kopi.alert(err.responseJSON.summary, err.responseJSON.invalidAttributes[0], 'error')
                })

            }
        })
    }
}
var log = new Model("Officerlog");
