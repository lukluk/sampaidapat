kopi.array = {};
kopi.array.merge = function (a, b) {
    var c = {};
    for (var i in a) {
        c[i] = a[i];
    }
    for (var j in b) {
        c[j] = b[j];
    }
    return c;
}
kopi.array.find = function (o, key, val) {
    for (var i in o) {
        if (o[i][key] == val) {
            return o[i]
        }
    }
}