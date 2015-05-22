var mysql = require('mysql');
var S = require('string');
var request = require('request');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Love2Love',
    database: 'akucari'
});

connection.connect();
var express = require('express');
var app = express();

var index = 0;
var price_word = ['dibawah', 'di bawah', 'diatas', 'di atas'];
var terbilang = {
    sejuta: '1000000',
    seratus: '100000'
};
var kali = {
    juta: '1000000',
    ratus: '100000',
    ribu: '1000'
};

function queryNext(xkata2, kata, callback, keyword) {
    kata = S(kata).trim().s;
    if (kata && kata != '') {
        connection.query('select katadasar,tipe_katadasar from kata where katadasar="' + kata + '"', function(err, rows, fields) {
            if (err) throw err;


            if (rows.length > 0) {
                if (rows[0].tipe_katadasar == "Nomina" || rows[0].tipe_katadasar == "Adjektiva")
                    keyword.push(kata);
            } else {
                keyword.push(kata);

            }
            index += 1;
            kata = xkata2[index];
            //console.log(kata);
            if (kata) {
                queryNext(xkata2, kata, callback, keyword);
            } else {
                callback && callback(keyword);
            }

        });
    } else {
        index += 1;
        kata = kata2[index];
        queryNext(xkata2, kata, callback, keyword);
    }

}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
app.get('/', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var input = req.query.input;
    index = 0;
    input = S(input).replaceAll('"', ' ').replaceAll("'", ' ').replaceAll(',', ' ').replaceAll('  ', ' ').replaceAll('.', '')
        .replaceAll(' ribu', 'ribu').replaceAll(' juta', 'juta').replaceAll('di bawah', 'dibawah').replaceAll('di atas', 'diatas').s;
    var kata2 = input.split(' ');
    var pricen = false;
    var junk = [];
    var price = false;
    var price_condition = false;
    for (var n in kata2) {
        if (kata2[n] == "harga") {
            pricen = parseInt(n);
            junk.push("harga");
        }

    }

    if (pricen > -1) {
        for (var key in kali) {
            //console.log((kata2[pricen + 1]).indexOf(key), key, kata2[pricen + 1]);
            if ((kata2[pricen + 1]).indexOf(key) > -1) {

                price = parseInt((kata2[pricen + 1]).replace(/\D/g, '')) * kali[key];

                junk.push(kata2[pricen + 1]);
            }
            //price=terbilang[]
        }
        if (price_word.indexOf(kata2[pricen + 1]) > -1) {

            price_condition = kata2[pricen + 1];
            junk.push(price_condition);

            if (isNumeric(kata2[pricen + 2])) {

                price = kata2[pricen + 2];
                junk.push(price);
            }

            for (var key in terbilang) {
                if (key == kata2[pricen + 2]) {
                    price = terbilang[key];
                    junk.push(kata2[pricen + 2]);
                }
                //price=terbilang[]
            }
            for (var key in kali) {
                if ((kata2[pricen + 2]).indexOf(key) > -1) {
                    price = parseInt((kata2[pricen + 2]).replace(/\D/g, '')) * kali[key];

                    junk.push(kata2[pricen + 2]);
                }
                //price=terbilang[]
            }

        }


    }

    for (var n in junk) {
        input = S(input).replaceAll(junk[n], '').s;
    }

    kata2 = input.split(' ');
    var kalimat = [];
    for (var n in kata2) {
        if (kata2[n] && kata2[n] != '')
            kalimat.push(kata2[n])
    }

    queryNext(kalimat, kalimat[0], function(keyword) {
        if (keyword.length > 0) {
            var data = {
                input: req.query.input,
                keyword: keyword.join(' '),
                price: price,
                price_condition: price_condition
            }
            var skeyword = S(data.keyword).slugify().s;
            console.log("URL", 'http://olx.co.id/all-results/' + skeyword + '/');
            request('http://olx.co.id/all-results/' + skeyword + '/', function(error, response, body) {
                if(error){
                    res.json({
                        error:true
                    })
                }
                if (!error && response.statusCode == 200) {
                    console.log(body) // Show the HTML for the Google homepage. 
                    res.json({
                        success:true
                    })
                }else{
                    res.json({
                        success:false,
                        status:response.statusCode
                    })
                }
            })
        } else {
            res.json({
                error: true
            })
        }
    }, []);

});



var server = app.listen(3000, function() {

    var host = '127.0.0.1';
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
