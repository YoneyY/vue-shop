<template>
  <div id="login-container">
    <div id="login-box">
      <!-- 登录logo -->
      <div id="login-logo">
        <img src="../assets/img/logo.png" alt="用户登录logo">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="restForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      loginFormRules:{
        username : [
          { required: true, message: '用户名不能为空',trigger:'blur'},
        ],
        password : [
          { required: true, message: '密码不能为空',trigger:'blur'},
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async vali=>{
        const {data:ret} = await this.$http.post('login',this.loginForm);
        // console.log(ret);
        if(ret.meta.status != 200){
          return this.$message.error('用户名或密码不正确');
        }

        // 村session中
        window.sessionStorage.setItem('token',ret.data.token)

        // user : admin  pwd : 123456  使用此账号登录
        this.$router.push('/welcome');
        this.$message.success('登录成功')
      })
      
    },
    restForm () {
      this.$refs.loginFormRef.resetFields();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#login-container{
  height: 100%;
  background-color: #2B4A6A;
  #login-box{
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    #login-logo{
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
      background-color: #fff;
      padding: 8px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #EDEDED;
      }
    }
    .el-form{
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      padding: 20px;
    }
  }
}
</style>
