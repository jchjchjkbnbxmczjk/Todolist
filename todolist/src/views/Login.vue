<!-- <template>
<div>
这是一个登录页面
</div>
</template>
<script>

</script>
<style>

</style> -->


<template>
  <div id="background">
    <div class="container">
      <form action="">
        <h1>Login</h1>
        <div class="form">
          <div class="item">
            <label>用户名：</label><input type="text" name="username" v-model.trim="username" placeholder="请输入用户名">
            <!-- v-model把输入的值传输给name变量 -->
            <br />
          </div>
          <div class="item">
            <label>密码：</label><input type="password" name="password" v-model.trim="password" placeholder="请输入密码">
            <br />
          </div>
          <div class="keep">
            <p></p>
            <input @click="handlesave" id="yes" type="radio" value="0"><!-- 点击选中 -->
            <label for="yes">保持登录状态</label>
            <p></p>
          </div>
        </div>

      </form>
      <el-button type="submit" @click="requestTest" @click.prevent="openLoading" v-loading="loading" plain>登录</el-button>
      <!-- v-on点击按钮触发handlelogin方法 -->
      <el-button @click="loadingChange" @click.prevent="handleregister">注册</el-button>
      <router-view />
    </div>
  </div>
</template>

<script>
// import service from '@/utils/request';
import service from "../utils/request"
import axios from 'axios'

export default {
  data() {
    return {
      username: "",//姓名，用v-model绑定监听，将输入的字符串赋值给name变量
      password: "",//密码
      st: "false",//false为不保存登录
      loading: false,
      loadingChange: ''
    };

  },
  methods: {
    openLoading: function () {
      if (this.name === localStorage['username'] && this.password === localStorage['password']) {
        // 登录成功就存token
        //用sessionStorage本地存储方法
        // sessionStorage.setItem('token', "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJxcXEiLCJhY2NvdW50IjoicXFxIiwiZXhwIjoxNzAwMDQ0NTIxfQ.SFzC-yuHl2XcS5arwRSSkeJFweDhX4R-65ilWyHe2EU")
        // sessionStorage.setItem('token', "123");
        //在点击登录时，添加loading加载组件，保证一秒后跳转到todolist界面
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        });
        setTimeout(() => {
          loading.close();

          // // 从sessionStorage中获取token
          // const token = sessionStorage.getItem('token');

          this.$router.push({ name: 'Todo' })//如果输入的名字以及密码正确路由跳转至个人页面
        }, 1000);  //登录正确后，过一秒跳转到todolist界面


        // this.$router.push({path:'/todo'});//如果输入的名字以及密码正确路由跳转至个人页面
      }
      else if (this.username === '')//名字为空
      {
        alert('用户名不为空');
      }
      else if (this.password === '')//密码为空
      {
        alert('密码不为空');
      }
      else {
        alert('账号不存在，请注册后登录');//查无此号
      }
    },

    // loadingChange(){
    //   this.openLoading()
    // },

    handleregister: function () {

      console.log('这是this.$router', this.$router);
      this.$router.push({ path: '/register' })//点击注册按钮，跳转至注册页面
    },
    //点击保持登录状态触发handlesave
    handlesave: function () {
      this.st = "true";//修改登录状态为true
      localStorage.setItem('s', this.st);
      console.log(localStorage.s);
    },



    requestTest(formName) {
      // this.$refs[formName].validate(valid => {
      // if (valid) {
      //   service.post('http://10.23.98.35:3080/user/login', {
      //     acount: this.username,
      //     password: this.password,

      //   })
      //     .then(function (response) {
      //       console.log(response);
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });

      //   console.log("password: " + this.password);
      // } else {
      //   console.log('error submit!!');
      //   return false;
      // }

      console.log(12112);

      axios.post('http://114.132.67.226:23080/user/login', {
        account: this.username,
        password: this.password,

      })
        .then(function (response) {
          console.log(response.data.token);
          sessionStorage.setItem('token', response.data.token)
        })
        .catch(function (error) {
          console.log("error:" + error);
        });

      console.log(21378);


      // });

      //       service.post('http://10.23.98.35:3080/user/login', {
      //         account: this.username,
      //         password: this.password

      //       })
      //         .then(function (response) {
      //           console.log(response);
      //         })
      //         .catch(function (error) {
      //           console.log(error);
      //         });

      //       // console.log("formName:" + JSON.stringify(formName));

      //       console.log("acount:" + this.username);

      //       console.log("password: " + this.password);
    }


  }
};
</script>
  


  //css
<style scoped>
#background {
  width: 100%;
  height: 100%;

  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.container {
  width: 480px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #99A9BF;
  text-align: center;
  border-radius: 20px;
  margin-top: 10px;
}

.container h1 {
  color: aliceblue;
  margin-left: 20px;
}

.item {
  color: white;
  margin-left: 15%;
  margin-top: 35px;
  font-size: 20px;
  text-align: left;
}

.item label {
  float: left;
  width: 5em;
  margin-right: 1em;
  text-align: right;
}

input {
  margin-left: -5px;
  padding: 4px;
  border: solid 1px #58B7FF;
  outline: 0;
  font: normal 13px/100% Verdana, Tahoma, sans-serif;
  width: 200px;
  height: 23px;
  background: #f1f1f190;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
}

el-button {
  position: relative;
  height: 33px;
  width: 100px;
  background: #58b7ff;
  border-radius: 10px;
  margin-top: 18px;
  box-shadow: none;
  color: white;
  margin-left: 40px;
  margin-right: 10px;

}

.keep {
  color: white;
}

.keep input {
  width: 15px;
  height: 15px;
  margin-top: 7px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
  