//mock数据，在服务器真正返回response之前使用。
fakeData()

//上面是假的后台
//Model层，对数据的所有操作放在这里
let model = {
  data: {
    name: 'aaa',
    number: 222,
    id: ''
  },
  fetch(id){
    //ES6中的模版表达式，在反引号中，使用${}可以插入变量
    return axios.get(`/books/${id}`).then((response)=>{
      this.data = response.data
      return response
    })
  },
  update(id, data){
    return axios.put(`/books/${id}`, data).then((response)=>{
      this.data = response.data
      return response
    })
  }
}

//View层，对界面的所有操作放在这里
let view = {
  el: '#app',
  template: `
    <div>
      书名：《__name__》
      数量：<span id="number">__number__</span>
      <div>
          <button id="addOne">加1</button>
          <button id="minusOne">减1</button>
          <button id="reset">归零</button>
      </div>
    </div>
  `,
  render(data){
    let html = this.template.replace('__name__', data.name)
      .replace('__number__', data.number)
    $(this.el).html(html)
  }
}

//Controller层，主要的业务逻辑操作放在这里
var controller = {
  //这2个属性可以省略，JavaScript会默认加上。
  view: '',
  model: '',
  //初始化数据，绑定事件
  init(options){
    //this.view中的view是controller的属性而不是一个普通的变量
    this.view = options.view
    this.model = options.model

    this.view.render(this.model.data)

    this.bindEvents()

    this.model.fetch(1).then(()=>{
      this.view.render(this.model.data)
    })
  },
  addOne(){
    var oldNumber = $('#number').text()
    var newNumber = oldNumber -0 +1
    this.model.update(1, {number: newNumber}).then(()=>{
      this.view.render(this.model.data)
    })
  },
  minusOne(){
    var oldNumber = $('#number').text()
    var newNumber = oldNumber -0 -1
    this.model.update(1, {number: newNumber}).then(()=>{
      this.view.render(this.model.data)
    })
  },
  reset(){
    this.model.update(1, {number: 0}).then(()=>{
      this.view.render(this.model.data)
    })
  },
  bindEvents(){
    //this === controller, bind 保证addOne里面的this都是指向controller的。
    //采用事件委托方式绑定事件，避免app里的内容被重新更新后，事件响应不起作用。
    $(this.view.el).on('click', '#addOne', this.addOne.bind(this))
    $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this))
    $(this.view.el).on('click', '#reset', this.reset.bind(this))
  }
}
//初始化，传入view和model
controller.init({view: view, model: model})
 

function fakeData(){
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
        //将JSON字符串转成对象
        data = JSON.parse(data)
        //部分赋值语法，可以将data的值批量更改到book里面。
        Object.assign(book, data);
        response.data = book;
      }
      return response;
    })
  }