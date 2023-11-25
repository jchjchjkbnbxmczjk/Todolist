<template>
  <div id="background">
    <div id="contain">
      <h1>Register</h1>
      <!-- //绑定了表单数据模型和验证规则，使用 ref 属性给表单命名为 "ruleFormRef" -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item class="form" prop="username">
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

        <el-form-item class="form" prop="phone">
          <div>
            <label for="phone">手机号:</label>
            <el-input type="text" v-model="ruleForm.phone" id="phone" class="input-box" placeholder="请输入手机号"></el-input>
            <el-button size="medium" round type="text" :disabled="isSend" @click.prevent="sendMsg">{{ isSend ? count :
              "发送验证码" }}
            </el-button>
            <!-- <button-One @click="zhenshiRequest">
            </button-One> -->
          </div>
        </el-form-item>
        <el-form-item class="form">
          <div>
            <label>验证码：</label>
            <el-input class="input-box" v-model="yanzhengma" placeholder="请输入验证码"></el-input>
          </div>
        </el-form-item>

      </el-form>
      <button @click="submitRegister" @keydown.enter="submitRegister">提交</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import service from "../utils/request"
export default {
  props: {
    msg: String
  },
  data() {
    //表单验证
    let validatePass = (rule, value, callback) => {
      // let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.againpassword !== "") {
          //通过引用获取表单对象
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
      //定义表单数据模型 ruleForm
      ruleForm: {
        pass: "",
        checkPass: "",
        username: "",
        password: "",
        // mail: "",
        phone: '',
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
        phone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ]
      },
    }
  }, methods: {
    //验证码
    zhenshiRequest() {
      console.log("huh");
      const res = service.get(`/user/smscode?tele=${this.ruleForm.phone}`)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(65);
          console.log("error:" + error);
        });
      console.log("fasong");
      console.log("phone:" + this.ruleForm.phone);

    },


    //发送验证码
    async sendMsg() {
      if (!this.ruleForm.phone || this.ruleForm.phone.length !== 11) {
        alert("请输入真实的手机号码")
        return
      }
      await this.zhenshiRequest();
      // const res = await zhenshiRequest()
      // console.log(res);
      //设计倒计时功能
      this.isSend = true
      this.timeVal = setInterval(() => {
        if (this.count === 0) {
          this.count = 60
          this.isSend = false
          clearInterval(this.timeVal)
        }
        this.count--
      }, 1000)
        .then(response => {
          console.log('发送验证码成功', response.data);
        })
        .catch(error => {
          console.error('发送验证码失败', error);
        });
    },

    //点击完成按钮触发 submitRegister
    submitRegister: function () {
      this.$refs['ruleFormRef'].validate((valid) => {
        console.log(valid);
        if (valid) {
          if (localStorage['name'] === this.ruleForm.username) {
            alert("用户名已存在");//如果用户名已存在则无法注册
            return;
          }

          if (!this.ruleForm.username) {
            alert("用户名不能为空");
            return;
          } else {


            console.log(this.ruleForm);

            localStorage.setItem('name', this.ruleForm.username);
            localStorage.setItem('password', this.ruleForm.pass);
            localStorage.setItem('password', this.ruleForm.checkPass);
            localStorage.setItem('tel', this.ruleForm.phone);
            localStorage.setItem('s', "false");
            this.$router.replace('/login');
            //完成注册后跳转至登录页面
          }

          const res = service.post('/user/signup', {
            account: this.ruleForm.username,
            password: this.ruleForm.pass,
            againpassword: this.ruleForm.checkPass,
            phone: this.ruleForm.phone,
            sms: this.yanzhengma

          })
            .then(function (response) {
              alert("注册成功");
              this.$router.replace('/login');
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })


    }
  }
};
</script>




//css
<style scoped>
#background {
  width: 110%;
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
  left: 44%;
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
