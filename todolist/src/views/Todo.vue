<template>
  <div id="App">

    <img width="width" :height="height">
    <div class="todolistBox">
      <!-- //页面头部 -->
      <div class="header-box">
        <div class="header-left">
          <div>
            <i class='el-icon-edit'></i>
          </div>
          <h2>To-do</h2>
        </div>
        <!-- //搜索框 -->
        <el-input class="searchInput" placeholder="请输入搜索内容" v-model="content" clearable>
          <!-- //这是Vue.js的模板标签，#append是模板的ID -->
          <template #append>
            <el-button @click="getToDoList" icon="el-icon-search"></el-button>
          </template>
          <ul>
            <li v-for="todo in todoLists" :key="todo.id">
              {{ todo.content }}
            </li>
          </ul>
        </el-input>

        <div class="header-right">
          <button class="headerAll" @click="selectAll">全选</button>
          <button class="headerAdd" @click="handleAdd">添加</button>
        </div>
      </div>

      <!-- //页面主体部分 -->
      <a-layout-content>
        <div class="content">
          <div class="content-item" v-for="(item, index) in todoLists" :key="item.id">
            <!-- 点击选中 -->
            <div class="content-left">
              <div>
                <span :style="item.isCheck ? 'opacity : 1' : 'opacity : 0'" @click="selectTest(index, item.id)">
                </span>
              </div>
            </div>
            <!-- input输入框 -->
            <input class="content-input" v-model="item.content" icon="thing" placeholder="请输入任务"
              onIconClick={this.handleIconClick.bind(this)} :disabled="item.isCheck"
              :class="item.isCheck ? 'line-through' : ''" @blur="leaveTest">

            <!-- 添加以下行，显示 updataTime -->
            <p>{{ item.updateTime }}</p>

            <!-- 时间以及删除按钮 -->
            <div class="content-right">
              <p>{{ item.time }}</p>
              <button class="deleOne" @click="deleOne(index, item.id)">删除</button>
            </div>
          </div>
        </div>
        <!-- //分页查询 -->
        <div class="pageContainer">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            layout="sizes, prev, pager, next" :page-size="query.pages" :current-page="query.index"
            :page-sizes="[2, 20, 30, 40]" :total="total" />
        </div>

      </a-layout-content>
    </div>
    <a-layout-footer>

      <el-button @click="loadingChange" type="primary" pain> 使用说明</el-button>
      <!-- <Button type="text" @click="loadingChange">点击打开 Message Box</Button> -->
      <!-- <li >
      <router-link to="/HomeView">使用说明</router-link>
   </li> -->
      <!-- <router-view></router-view> -->
    </a-layout-footer>

  </div>
  <!-- </ul> -->
</template>
  
<script >
//格式化引入插件dayjs
import dayjs from "dayjs"
import axios from "axios"
import service from "../utils/request"
export default {
  name: 'App',
  data() {
    content: ""
    return {
      // content: "",
      todoLists: [],
      total: 0,
      // loading:false,
      width: 0,
      height: 0,
      content: "",
      query: {
        // label: '',
        label: '',
        pages: 10,
        index: 1,
      },

    };
  },
  // //响应式
  // mounted() {
  //   window.addEventListener('resize', this.handleResize)
  // },
  // beforeDestroy() {
  //   window.removeEventListener('resize', this.handleResize)
  // },
  mounted() {
    // this.getToDoList();
    console.log('组件已挂载');
    // 假设你有一个包含授权令牌的变量，名为'token'
    const token = sessionStorage.getItem('token');
    // 在请求头中添加token，发送GET请求
    try {
      //  // 从sessionStorage中获取token
      // const token = sessionStorage.getItem('token');
      const res = service.get("/task");
      console.log('res:', res.content);
    } catch (error) {
      console.log(error);
    }
  },




  //读取所存储的数据
  created() {
    let getList = JSON.parse(window.localStorage.getItem('listTodo'))
    if (getList == null) {  //判断内容是否为空
      this.todoLists = [{
        id: this.randomID(),  //需要id作为唯一标识
        isCheck: false, //是否选中
        text: "",  //输入框中的内容
        time: dayjs(new Date).format("YYYY-MM-DD HH:mm")  //时间
      }
      ]
    }
    else {
      this.todoLists = getList;
    }


  },
  methods: {
    loadingChange() {
      //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   this.$Message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$Message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
      //添加Message消息提示组件
      const h = this.$createElement;
      this.$notify({
        title: '提示：',
        type: "warning",  //设置警告标识
        message: h('i', { style: 'color:teal' }, '请点击添加进行增加任务框 请点击输入框的左侧表示任务已完成')
      });
    },

    async getToDoList() {
      // 假设你有一个包含授权令牌的变量，名为'token'
      const token = sessionStorage.getItem('token');
      // console.log('getToDoList')
      // 在请求头中添加token，发送GET请求
      try {
        // // 从sessionStorage中获取token
        // const token = sessionStorage.getItem('token');
        const res = await service.get("/task/content", {
          params: { content: this.content },
        });
        // this.todoLists = res.data;
        // window.alert(res);
        console.log('res:', res.data);
        if (res.data.length > 0) {
          this.todoLists = res.data;
          // for (let i = 0; i < res.data.length; i++) {
          //   this.todoLists.push(res.data[i])
          // }
          console.log('do:', res); // 访问第一个对象的 id 属性
          // window.alert('do:' + res.data); // 弹出 id
        } else {
          this.todoLists = [];
          console.log('未收到有效数据。');
        }
      } catch (error) {
        console.log(error);
      }
      // finally {
      //   this.todoLists = [
      //     {
      //       "id": 69,
      //       "content": "222",
      //       "updateTime": [
      //         2023,
      //         11,
      //         14,
      //         21,
      //         22,
      //         17
      //       ],
      //       "label": "laborum exercitation Ut magna",
      //       "serialNumber": 3,
      //       "status": 0
      //     },


      //   ];
      // }


    },
    //异步函数声明
    async getPageList() {
      //  // 从sessionStorage中获取token
      const token = sessionStorage.getItem('token');
      //发送get请求
      try {
        const res = await service.get("/task/page", {
          params: {
            ...this.query
          },
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   'Content-Type': 'application/json', // 根据你的需求设置 Content-Type
          // },
        });
        this.todoLists = res.data.tasks;
        this.total = res.data.total
      } catch (error) {
        console.log(error);
        // console.log(error.response.data)
      }
    },

    //响应式设计
    handleResize() {
      this.width = window.innerWidth
      this.height = window.innerHeight
    },

    //每页显示多少条数据
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.query.pages = val;
      this.getPageList()
    },
    //当前页数
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
      this.query.index = val;
      this.getPageList()
    },


    //  addTodo: function (text) {
    //   this.todos.push({
    //     text: text,
    //     done: false
    //   })
    // },

    //实现添加功能
    handleAdd() {
      //记录;并且点击添加之后向下运行
      this.todoLists.unshift({
        id: this.randomID(),  //需要id作为唯一标识
        isCheck: false, //是否选中
        text: "",  //输入框中的内容
        time: dayjs(new Date).format("YYYY-MM-DD HH:mm")  //时间
      })
      //    //点击添加之后获取焦点
      //  const inputLength=this.todoLists.length -1
      //  this.$nextTick(() => {     //保证渲染完成之后获取焦点
      //   this.$refs.inputBox[this.inputLength].focus()
      //  })

      // const token = sessionStorage.getItem('token');
      // const res = service.post('/task', {
      //   content: this.content,


      // })
      //   .then(response => {
      //     console.log(response);
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });



    },
    //实现删除功能
    deleOne(index, id) {
      if (this.todoLists[index].id == id)
        this.todoLists.splice(index, 1)  //删除一条
      this.storageTest();
      console.log('id:' + this.todoLists[index].id);
      // 发送请求
      const token = sessionStorage.getItem('token');
      try {
        const response = service.delete(`/task/${this.todoLists[index].id}`, {
          // headers: {
          //   token: `${token}`,
          //   'Content-Type': 'application/json', // 根据你的需求设置 Content-Type
          // },
        });

        // 处理响应
        console.log(response.data);
      } catch (error) {
        // 处理错误
        console.error('Error:', error);
      }
    },
    //实现选中功能
    selectTest(index, id) {
      console.log(index);
      console.log(id);
      if (this.todoLists[index].id === id) {  //判断index的id是否等于当前的id
        this.todoLists[index].isCheck = !this.todoLists[index].isCheck //点击一次为真（true）再点一次为假（false）
        this.storageTest();
      }
    },

    //实现全选功能
    selectAll() {
      this.todoLists.forEach(item => {
        if (item.isCheck == true) {    //如果点击了，就保持不变
          return;
        }
        item.isCheck = !item.isCheck;  //若没有点击，则更改取反
        this.storageTest();
      })
    },

    //判断是否输入完成
    leaveTest() {
      console.log("输入完成");
      this.storageTest();
    },

    //实现本地存储
    storageTest() {
      window.localStorage.setItem('listTodo', JSON.stringify(this.todoLists))
    },
    //生成随机ID
    randomID() {
      return Number(Math.random().toString().substring(2, 0) + Date.now()).toString(10)
    },


  }
}
</script>
  
<style lang="scss">
//按钮的共同样式
button {
  padding: 5px 10px; //设置宽度以及高度
  border-radius: 8px;
  margin-left: 10px;
}

//搜索框
.searchInput {
  width: 60%;
}

.todolistBox {
  width: 50%;
  height: 90%;
  background: #8492A6;
  border-radius: 10px;
  position: absolute;
  top: 13%; //设置距离顶部的距离
  left: 22%;
  padding: 20px;
  box-sizing: border-box;

  .header-box {
    display: flex;
    justify-content: space-between;
    display: flex;
    align-items: center;
    border-bottom: #1F2D3D 1px solid;
  }

  .header-left {
    display: flex;
    align-items: center;

    h2 {
      font-size: 30px;
      font-family: fantasy;
    }

    div {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 30px;
      margin-right: 5px;
    }
  }

  .header-right {
    .headerAll {
      background: #FFFFFF;
    }

    .headerAdd {
      background: #FFFFFF;
    }
  }

  //对头部以下部分布局
  .content {
    margin-top: 20px;
    height: 450px;
    overflow-y: scroll; //设置滚动 

    .content-item {
      &:hover {
        background: #8492A6;

        button {
          display: block;
        }
      }

      margin-top: 15px; //每个输入框上下隔开
      display:flex;
      justify-content: space-between; //均匀排列每个元素首个元素放置于起点，末尾元素放置于终点
      background:#D3DCE6;
      align-items: center;
      border-radius: 8px;
      padding:16px; //主体内容中外框的上下宽窄

      .content-left {
        //按钮的位置
        position: relative;
        width: 15px;
        height: 15px;
        border-radius: 100%;

        span {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #EFF2F7;
          border-radius: 100%;
          position: absolute;
          top: 1px;
          left: 60%;
          padding: 10px;
        }
      }

      .line-through {
        color: rgba(255, 255, 255, 0.33); //文字颜色
        text-decoration: line-through rgba(255, 255, 255, 0.5); //横线颜色
      }

      .content-right {
        display: flex;

        button {
          background: #E5E9F2;
        }

        //设置主体部分右边时间的样式
        p {
          font-size: 16px;
          padding: 10px 10px;
        }
      }

      .content-input {
        flex: 1px;
        margin: 0% 30px; //输入框的上下为0，左右为30px
        outline: none; //去除选中效果
        padding: 5px 10px;
      }
    }
  }

}

//分页查询
.pageContainer {
  text-align: right;
}
</style>
  
