//mock数据，在服务器真正返回response之前使用。

//设置请求服务器的基地址，否则会出现404
axios.defaults.baseURL = 'http://localhost:8080'
//设置初始值
let book = {
    name: 'JavaScript 高级程序设计',
    number: 2,
    id: 1 
};
//拦截器，拦截服务器的response回来的数据，作二次处理。
axios.interceptors.response.use(function(response) {
  //解构赋值，可以将response里面的config属性的method,url,data赋值给左边。
    let {
      config: {
        method, url, data
      }
    } = response;

    if (url === 'http://localhost:8080/books/1' && method === 'get') {
      response.data = book;
    }else if(url === 'http://localhost:8080/books/1' && method === 'put'){
      //部分赋值语法，可以将data的值批量更改到book里面。
      Object.assign(book, data);
      response.data = book;
    }
    return response;
  })
//上面是假的后台

axios.get('/books/1').then(({data})=>{
  let originalHtml = $('#app').html();
  let newHtml = originalHtml.replace('__name__', data.name).replace('__number__', data.number)
  $('#app').html(newHtml)
})

//事件委托，避免app里的内容被重新更新后，事件响应不起作用。
$('#app').on('click', '#addOne', function(){
  var oldNumber = $('#number').text()
  var newNumber = oldNumber -0 +1
  axios.put('/books/1', {
    number: newNumber
  }).then(()=>{
    $('#number').text(newNumber)
  })
})
$('#app').on('click', '#minusOne', function(){
  var oldNumber = $('#number').text()
  var newNumber = oldNumber -0 -1
  $('#number').text(newNumber)
})
$('#app').on('click', '#reset', function(){
  $('#number').text(0)
})