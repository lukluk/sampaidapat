function search() {
    $.get('http://127.0.0.1:3000', {
        input: $('#keyword').val()
    }, function(data) {
        console.log(data);
    })
}
app.get('/', function(req) {

    kopi.render('search.html').to('body');
    $('#search').click(function() {
        search();
    })
    $('#keyword').enterKey(function() {
        search();
    })
});
