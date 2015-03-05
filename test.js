/**
 * Created by 01 on 2015/1/15.
 */
 var http = require('http');
var url = 'http://bigtimetest.urming.com/templates/publish/want.html';
http.get(url, function(res){
    console.log(res.headers);
    var buffer = [];
    res.on('data', function(data){
        buffer.push(data.toString());
    });
    res.on('end', function(){
        console.log(buffer.join(''));
    });
}).on('error', function(ex){
    console.error(ex);
});