<template>
  <div id="background">
    <div id="contain">
      <h1>Register</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">

        <el-form-item class="form">
          <label>用户名：</label>
          <el-input class="input-box" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item class="form" prop="pass">
          <label>密码：</label>
          <el-input type="password" class="input-box" v-model="ruleForm.pass" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item class="form" prop="checkPass">
          <label>确认密码：</label>
          <el-input type="password" class="input-box" v-model="ruleForm.checkPass" placeholder="请再次输入密码"></el-input>
        </el-form-item>

        <el-form-item class="form" prop="phoneNumber">
          <div>
            <label for="phoneNumber">手机号:</label>
            <el-input type="text" v-model="ruleForm.phoneNumber" id="phoneNumber" class="input-box"
              placeholder="请输入手机号"></el-input>
            <button :disabled="isSend" @click.prevent="sendMsg">{{ isSend ? count : "发送验证码" }}</button>
          </div>
        </el-form-item>
        <el-form-item class="form">
          <div>
            <label>验证码：</label>
            <el-input class="input-box" v-model="yanzhengma" placeholder="请输入验证码"></el-input>
          </div>
        </el-form-item>

        <!-- <el-form-item class="form">
          <label>手机号：</label>
          <el-input class="input-box" v-model="ruleForm.tel" placeholder="请输入手机号"></el-input>
        </el-form-item> -->

      </el-form>
      <button @click="submitRegister" @keydown.enter="submitRegister">提交</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    msg: String

  },
  data() {
    let validatePass = (rule, value, callback) => {
      // let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.againpassword !== "") {
          this.$refs.ruleFormRef.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正确的手机号"));
      } else if (value.length !== 11) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    }


    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        username: "",
        password: "",
        // mail: "",
        phoneNumber: '',
      },
      yanzhengma: "",
      timeVal: null,
      count: 60,
      isSend: false,
      //效验规则
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "change" },
        ],
        phoneNumber: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ]
      },



    }
  }, methods: {
    async sendMsg() {
      // 点击按钮模拟请求验证码 写了个定时器 两秒之后返回发送验证码成功
      // 假设一个真实的请求

      // const zhenshiRequest = () => {
      //   return axios.post('https://your-api-endpoint.com/send-verification-code', {
      //     phoneNumber: this.phoneNumber,
      //   })
      // }

      const moniRequest = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("发送验证码成功")
          }, 2000)
        })
      }
      if (!this.ruleForm.phoneNumber || this.ruleForm.phoneNumber.length !== 11) {
        alert("请输入真实的手机号码")
        return
      }


      const res = await moniRequest()
      console.log(res);

      this.isSend = true
      this.timeVal = setInterval(() => {
        if (this.count === 0) {
          this.count = 60
          this.isSend = false
          clearInterval(this.timeVal)
        }
        this.count--
      }, 1000)


      // const res = 
      //   .then(response => {
      //     console.log('Verification code sent successfully', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error sending verification code', error);
      //   });
    },

    //点击完成按钮触发handlefinish
    submitRegister: function () {
      if (localStorage['name'] === this.ruleForm.username) {
        alert("用户名已存在");//如果用户名已存在则无法注册
        return;
      }

      if (!this.ruleForm.username) {
        alert("用户名不能为空");
        return;
      } else {


        // console.log(this.ruleForm);

        localStorage.setItem('name', this.ruleForm.username);
        localStorage.setItem('password', this.ruleForm.checkPass);
        // localStorage.setItem('mail', this.ruleForm.mail);
        localStorage.setItem('tel', this.ruleForm.tel);
        localStorage.setItem('s', "false");
        alert("注册成功");
        this.$router.replace('/login');//完成注册后跳转至登录页面
      }
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

#contain {
  width: 580px;
  height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #00000090;
  text-align: center;
  border-radius: 20px;
}

#contain h1 {
  color: white;
}

.form {
  color: white;
  margin-left: 20%;
  margin-top: 50px;
  font-size: 20px;
  text-align: left;
}

label {
  float: left;
  width: 5em;
  margin-right: 1em;
  text-align: right;
}



button {
  position: relative;
  height: 33px;
  width: 100px;
  background: #324057;
  border-radius: 10px;
  box-shadow: none;
  color: white;
  margin-left: 40px;
}

.input-box {
  width: 300px;
  height: 30px;
}
</style>
