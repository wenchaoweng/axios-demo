1. server.js是服务器文件，先通过node server 8080启动一个服务器，其中如下是为了解决跨域问题
    response.setHeader("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");
    response.setHeader("Access-Control-Allow-Origin","*");
    response.setHeader("Access-Control-Allow-Methods","*"); 

2. http-server -c-1，然后在浏览器打开生成后的链接，如http://192.168.43.251:8081/index.html
