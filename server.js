var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  console.log('HTTP路径为\n' + path)

  if(path === '/'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(
      '<!DOCTYPE html>\n' + 
      '<html>\n' + 
      ' <head>\n' + 
      '   <link rel="stylesheet" href="/style.css">\n' +
      ' </head>\n' + 
      ' <body>\n' + 
      '   <h1>Hello, World!</h1>\n' +
      ' </body>\n' +
      ' <script src="/main.js"></script>\n' +
      '</html>')
    response.end()
  }else if(path === '/style.css'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write('body{background-color: #ddd;} h1{color: red}')
    response.end()
  }else if(path === '/main.js'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write('alert("这是JS执行的")')
    response.end()
  }else if(path === '/books/1'){
    response.statusCode = 200
    response.setHeader("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");
    response.setHeader("Access-Control-Allow-Origin","*");
    response.setHeader("Access-Control-Allow-Methods","*"); 
    response.end()
  }
  else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('Oh, No!')
    response.end()
  }
})

server.listen(port)
console.log('监听 ' + port + ' 成功, 打开 http://localhost:' + port)


