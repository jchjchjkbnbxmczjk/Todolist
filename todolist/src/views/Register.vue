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

        <el-form-item class="form">
          <label>邮箱：</label>
          <el-input class="input-box" v-model="ruleForm.mail" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item class="form">
          <label>手机号：</label>
          <el-input class="input-box" v-model="ruleForm.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>

      </el-form>
      <button @click="submitRegister" @keydown.enter="submitRegister">提交</button>
    </div>
  </div>
</template>

<script>
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


    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        username: "",
        password: "",
        mail: "",
        tel: "",
      },
      //效验规则
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "change" },
        ],
      },



    }
  }, methods: {
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


        console.log(this.ruleForm);

        localStorage.setItem('name', this.ruleForm.username);
        localStorage.setItem('password', this.ruleForm.checkPass);
        localStorage.setItem('mail', this.ruleForm.mail);
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
  height: 560px;
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
  margin-top: 60px;
  font-size: 20px;
  text-align: left;
}

label {
  float: left;
  width: 5em;
  margin-right: 1em;
  text-align: right;
}

input,
textarea {
  margin-left: 10px;
  padding: 4px;
  border: solid 1px #1D8CE0;
  outline: 0;
  font: normal 13px/100% Verdana, Tahoma, sans-serif;
  width: 200px;
  height: 20px;
  background: #f1f1f190;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
}

input:hover,
textarea:hover,
input:focus,
textarea:focus {
  border-color: #58B7FF;
}

button {
  position: relative;
  height: 33px;
  width: 150px;
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
