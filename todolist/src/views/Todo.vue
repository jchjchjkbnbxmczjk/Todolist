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
          <button class="headerAll" @click="selectAll">已完成</button>
          <button class="headerAdd" @click="handleAdd">添加</button>
          <!-- <button class="headerAll" @click="Finish">已完成</button> -->
        </div>
      </div>

      <!-- //页面主体部分 -->
      <a-layout-content>

        <div class="content">
          <draggable v-model="todoLists" @end="onDragEnd">
            <div class="content-item" v-for="(item, index) in todoLists" :key="item.id">
              <!-- 点击选中 -->
              <div class="content-left">
                <div>
                  <span :style="item.status ? 'opacity : 1' : 'opacity : 0'" @click="selectTest(index, item.id)">
                  </span>
                </div>

              </div>
              <!-- input输入框 -->
              <input class="content-input" v-model="item.content" icon="thing" placeholder="请输入任务"
                onIconClick={this.handleIconClick.bind(this)} :disabled="item.status == 1"
                :class="item.status ? 'line-through' : ''" @blur="leaveTest(index, item.id)">
              <span>{{ item.id }}</span>


              <!-- 添加以下行，显示 updataTime -->
              <p>{{ item.updateTime }}</p>

              <!-- 时间以及删除按钮 -->
              <div class="content-right">
                <p>{{ item.time }}</p>
                <button class="deleOne" @click="deleOne(index, item.id)">删除</button>
              </div>
            </div>
          </draggable>
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
    </a-layout-footer>

  </div>
  <!-- </ul> -->
</template>
  
<script >
//格式化引入插件dayjs
import dayjs from "dayjs"
import axios from "axios"
import service from "../utils/request"
import draggable from 'vuedraggable'
import { mapState } from 'vuex';
export default {
  components: {
    draggable,
    ...mapState(['todoLists']),
  },
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
        content: '',
        pages: 10,
        index: 1,
      },
      clickedIndex: 0,  // 在数据中添加 clickedIndex
    };
  },
  //监听数据的变化
  watch: {
    query: {
      //回调函数
      handler(newValue, oldValue) {
        this.getPageList()
      },
      deep: true, //深度监听
      // immediate: true  //组件创建时立即执行一次 handler
    },

  },
  //响应式
  // mounted() {
  //   window.addEventListener('resize', this.handleResize)
  // },
  // beforeDestroy() {
  //   window.removeEventListener('resize', this.handleResize)
  // },
  mounted() {

    // this.getToDoList();
    console.log('组件已挂载');
    // 从sessionStorage中获取token
    const token = sessionStorage.getItem('token');
    // 在请求头中添加token，发送GET请求
    try {
      // const token = sessionStorage.getItem('token');
      const res = service.get("/task")
        .then(res => {
          console.log("response:" + JSON.stringify(res.data));
          console.log('do:', res);
          if (res.data.length > 0) {
            this.todoLists = res.data;
            console.log('todo:', this.todoLists);
            console.log('do:', res.data);
          }
        }).catch(error => {
          console.error("error:" + error);
        })
      // this.handleAdd();
      // this.leaveTest();


      // this.getPageList()
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

    async fetchData() {
      await this.$store.dispatch('getTodoLists');
    },
    //实现拖拽排序功能
    onDragEnd(event, index) {
      // 拖放结束后的处理逻辑
      this.storageTest(); // 更新本地存储
      console.log("onDragEnd - event:", event);
      // this.todoLists({
      //   id: this.randomID(),  //需要id作为唯一标识
      // })
      // 获取任务的起始位置和结束位置的索引
      if (this.todoLists.length > 0) {
        const startIndex = event.oldIndex;
        const endIndex = event.newIndex;
        console.log("startIndex:", startIndex);
        console.log("endIndex:", endIndex);
        console.log(123);
        //  // 从sessionStorage中获取token
        const token = sessionStorage.getItem('token');
        //发送get请求
        try {
          const res = service.get("/task/sort", {
            params: {
              startNumber: this.todoLists[startIndex].id,
              endNumber: this.todoLists[endIndex].id,
            },
            // headers: {
            //  // 从sessionStorage中获取token
            //   'Content-Type': 'application/json', // 根据你的需求设置 Content-Type
            // },
          });
        } catch (error) {
          console.log(error);
          // console.log(error.response.data)
        }
      }
    },
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
      // // 从sessionStorage中获取token
      const token = sessionStorage.getItem('token');

      // 在请求头中添加token，发送GET请求
      try {
        const res = await service.get("/task/content", {
          params: { content: this.content },
        });
        console.log('res:', res.data);
        if (res.data.length > 0) {
          this.todoLists = res.data;

          console.log('do:', res); // 访问第一个对象的 id 属性
        } else {
          this.todoLists = [];
          console.log('未收到有效数据。');
        }

      }
      catch (error) {
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
      // this.query.pages = val;
      this.$set(this.query, 'pages', val)
    },
    //当前页数
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
      // this.query.index = val;
      //用于设置对象的响应式属性，属性是响应式的
      this.$set(this.query, 'index', val)

    },

    //实现添加功能
    handleAdd(index, id) {

      //    //点击添加之后获取焦点
      //  const inputLength=this.todoLists.length -1
      //  this.$nextTick(() => {     //保证渲染完成之后获取焦点
      //   this.$refs.inputBox[this.inputLength].focus()
      //  })

      const token = sessionStorage.getItem('token');
      const res = service.post('/task', {
        content: this.content,

      })
        .then(res => {
          console.log(res);
          console.log("res:", res.data.id);
          //记录;并且点击添加之后向下运行
          this.todoLists.unshift({
            id: res.data.id,  //需要id作为唯一标识
            // isCheck: false, //是否选中
            text: "",  //输入框中的内容
            status: false,
            time: dayjs(new Date).format("YYYY-MM-DD HH:mm")  //时间
          })

        })
        .catch(error => {
          console.error(error);
        });
      // this.mounted();
    },
    //实现删除功能
    deleOne(index, id) {
      console.log(index, id);
      if (this.todoLists[index].id == id)
        this.todoLists.splice(index, 1)  //删除一条
      this.storageTest();
      console.log('id:' + this.todoLists[index].id);

      // 发送请求
      const token = sessionStorage.getItem('token');
      try {
        const response = service.delete(`/task/${this.todoLists[index].id}`

        );

        // 处理响应
        console.log(response.data);
      } catch (error) {
        // 处理错误
        console.error('Error:', error);
      }
    },
    //实现选中功能（已完成）
    selectTest(index, id) {
      console.log(index);
      console.log(id);
      //put请求
      //  // 从sessionStorage中获取token
      const token = sessionStorage.getItem('token');
      const res = service.put(`/status?id=${this.todoLists[index].id}`,)
        .then(response => {
          // if (this.todoLists[index].id === id) {  //判断index的id是否等于当前的id
          //   this.todoLists[index].status = !this.todoLists[index].status //点击一次为真（true）再点一次为假（false）
          //   this.storageTest();
          // }
          this.todoLists[index].status = true
          // this.$set(this.todoLists[index], 'status', true)
          console.log(response);
        })
        .catch(error => {
          // Handle errors
          console.error(error);
        })
    },

    //实现全选功能(已完成)
    //根据已完成进行任务分类
    selectAll() {
      this.todoLists = [];
      // this.todoLists.forEach(item => {
      //   if (item.status == true) {    //如果点击了，就保持不变
      //     return;
      //   }
      //   item.status = !item.status;  //若没有点击，则更改取反
      //   this.storageTest();
      // })
      // 从sessionStorage中获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中添加token，发送GET请求
      try {
        console.log('abc');
        const res = service.get("/status", {
          params: { number: 1 },
        })
          .then(res => {
            console.log("response:" + JSON.stringify(res.data));
            console.log('do:', res);
            this.todoLists = res.data;
          }).catch(error => {
            console.error("error:" + error);
          })
        // this.handleAdd();
        // this.leaveTest();

        // this.getPageList()
      } catch (error) {
        console.log(error);
      }


    },

    //判断是否输入完成
    leaveTest(index, id) {
      console.log("输入完成");
      this.storageTest();
      //put请求
      const taskId = id; // 更新的任务的实际ID
      //  // 从sessionStorage中获取token
      const token = sessionStorage.getItem('token');
      // const id = this.todoLists[index].id;
      const updatedData = {
        // 更新的任务数据
        id: taskId,
        content: this.todoLists[index].content
        // 其他需要更新的字段
      };
      console.log("content:", this.todoLists[index].content);
      try {
        const response = service.put(`/task`, updatedData
        );
        // .then(response => {
        // Handle the successful response
        console.log(response.data);

      }
      // })
      // .catch(error => {
      catch (error) {
        console.error(error);
      }


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
//@media screen and (max-width: 768px) 

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
        color: rgba(10, 10, 10, 0.8); //文字颜色
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
  
