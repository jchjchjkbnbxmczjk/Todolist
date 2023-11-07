<template>

  <div id="app">  
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
    <div class="header-right">
      <button class="headerAll" @click="selectAll">全选</button>
      <button class="headerAdd" @click="handleAdd">添加</button>
    </div>
   </div>
  
 <!-- //页面主体部分 -->
 <a-layout-content >
    <div class="content">
    <div class="content-item"
    v-for="(item,index) in todoLists" :key="item.id"
    >
        <!-- 点击选中 -->
        <div class="content-left" >
          <div>
           <span :style="item.isCheck ? 'opacity : 1' :'opacity : 0'" @click="selectTest(index,item.id)">
           </span>   
          </div>
        </div>
        <!-- input输入框 -->
        <input class="content-input" v-model="item.text"
        icon="thing"
        placeholder="请输入任务"
        onIconClick={this.handleIconClick.bind(this)}
        :disabled="item.isCheck"
        :class="item.isCheck ? 'line-through' :'' "
        @blur="leaveTest" 
        />
        <!-- 时间以及删除按钮 -->
        <div class="content-right">
            <p>{{item.time}}</p>
            <button class="deleOne" @click="deleOne(index,item.id)">删除</button>
        </div>
      </div>
    </div>
  </a-layout-content>
   </div>
   <a-layout-footer>   
    <context-holder />
    <el-button @click="loadingChange" v-loading="loading" type="primary" pain> 使用说明</el-button>
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

export default{
name:'App',
    data(){
      return{
        todoLists:[ 
        ],
        // loading:false
        width: 0,
      height: 0
  }
},
//响应式
mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  




//读取所存储的数据
created(){
   let getList=JSON.parse(window.localStorage.getItem('listTodo'))
   if(getList==null){  //判断内容是否为空
    this.todoLists=[{
      id:this.randomID(),  //需要id作为唯一标识
      isCheck:false, //是否选中
      text:"",  //输入框中的内容
      time:dayjs(new Date).format("YYYY-MM-DD HH:mm")  //时间
    }
    ]
   }
   else {
    this.todoLists=getList;
   }
},
   methods:{
    loadingChange(){
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
const h=this.$createElement;
  this.$notify({
    title: '提示：',
    type:"warning",  //设置警告标识
    message:h('i',{style:'color:teal'},'请点击添加进行增加任务框 请点击输入框的左侧表示任务已完成')
  });
   },

//响应式设计
   handleResize() {
      this.width = window.innerWidth
      this.height = window.innerHeight
    },

  //  addTodo: function (text) {
  //   this.todos.push({
  //     text: text,
  //     done: false
  //   })
  // },

    //实现添加功能
    handleAdd(){
      //记录;并且点击添加之后向下运行
    this.todoLists.unshift({
            id:this.randomID(),  //需要id作为唯一标识
            isCheck:false, //是否选中
            text:"",  //输入框中的内容
            time:dayjs(new Date).format("YYYY-MM-DD HH:mm")  //时间
    })
  //    //点击添加之后获取焦点
  //  const inputLength=this.todoLists.length -1
  //  this.$nextTick(() => {     //保证渲染完成之后获取焦点
  //   this.$refs.inputBox[this.inputLength].focus()
  //  })
    },
    //实现删除功能
    deleOne(index,id){  
    if(this.todoLists[index].id==id)
       this.todoLists.splice(index,1)  //删除一条
       this.storageTest();
    },
    //实现选中功能
    selectTest(index,id){
        console.log(index);
        console.log(id);
        if(this.todoLists[index].id===id){  //判断index的id是否等于当前的id
       this.todoLists[index].isCheck=!this.todoLists[index].isCheck //点击一次为真（true）再点一次为假（false）
       this.storageTest();
      }
  },

  //实现全选功能
selectAll(){
  this.todoLists.forEach(item=>{
    if(item.isCheck==true){    //如果点击了，就保持不变
      return;
    }
   item.isCheck=!item.isCheck ;  //若没有点击，则更改取反
   this.storageTest();
  })
},

//判断是否输入完成
leaveTest(){
console.log("输入完成");
this.storageTest();
},

   //实现本地存储
   storageTest(){
window.localStorage.setItem('listTodo',JSON.stringify(this.todoLists))
   },
    //生成随机ID
    randomID(){
      return Number(Math.random().toString().substring(2,0)+Date.now()).toString(10)
    },

   
   }
}
</script>

<style lang="scss">



  //按钮的共同样式
button{
  padding: 5px 10px;   //设置宽度以及高度
  border-radius: 8px;   
  margin-left: 10px;    
}
.todolistBox{
   width:50%;
   height:80%;
   background:#8492A6;
   border-radius: 10px;
   position: absolute;
   top:13%;  //设置距离顶部的距离
   left:22%;
   padding: 20px;
   box-sizing: border-box;
   .header-box{
   display:flex;
   justify-content: space-between;
   display: flex;
    align-items: center;
    border-bottom: #1F2D3D 1px solid;
   }
   .header-left{
    display: flex;
    align-items: center;
    h2{
      font-size: 30px;
      font-family: fantasy;
    }
   div{
    width:50px;
    height:50px;
    border-radius: 50%;
    font-size: 30px;
    margin-right: 5px;
   }
   }
   .header-right{
    .headerAll{
         background:#FFFFFF ;
    }
    .headerAdd{
      background: #FFFFFF;
    }
   }
   //对头部以下部分布局
   .content{
    margin-top: 20px;
    height: 450px;
    overflow-y:scroll ;   //设置滚动 
    .content-item{
      &:hover{
        background:#8492A6;
        button{
          display: block;
        }
      }
      margin-top: 15px;  //每个输入框上下隔开
      display:flex;
      justify-content: space-between;  //均匀排列每个元素首个元素放置于起点，末尾元素放置于终点
      background:#D3DCE6;
      align-items: center;
      border-radius: 8px;
      padding:16px;   //主体内容中外框的上下宽窄
      .content-left{
        //按钮的位置
        position: relative;
        width: 15px;
        height: 15px;
        border-radius: 100%;
        span{
        display: inline-block;
        width:10px;
        height:10px;
        background:#EFF2F7;
        border-radius: 100%;
        position: absolute;
        top: 1px;
        left:60%;
        padding: 10px;
        }
      }
     
      .line-through{
        color:rgba(255, 255, 255, 0.33);   //文字颜色
        text-decoration: line-through rgba(255,255,255,0.5) ;  //横线颜色
      }

      .content-right{
        display: flex;
        button{
          background:#E5E9F2 ;
        }
  //设置主体部分右边时间的样式
       p{
        font-size: 16px;
        padding: 10px 10px;
       }
      }
      .content-input{
        flex:1px ;
        margin: 0% 30px;   //输入框的上下为0，左右为30px
       outline: none;   //去除选中效果
      padding: 5px 10px;     
      }
    }
   }
   
}
</style>
