<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img
          src="../assets/img/heima.png"
          alt=""
        >
        <span>电商管理后台系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      >退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuShow ? '65px' : '200px'">
        <!-- 隐藏按钮 -->
        <div
          style="color:#fff;
        text-align:center;
        font-size:12px;
        height:25px;
        line-height:25px;
        background-color:rgb(74,80,100);
        cursor:pointer;
        user-select:none;"
          @click="menuShow=!menuShow"
        >|||</div>
        <!-- 侧边栏 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="menuShow"
          :style="menuShow ? 'width:65px' : 'width:200px'"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu :index="item.id + ''" v-for="(item,i) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-' + menuIcon[i]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id"><i class="el-icon-menu"></i><span>{{item.authName}}</span></el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
  },
  data() {
    return {
      menuShow: false,
      menuList: [],
      menuIcon: ['users','tijikongjian','shangpin','danju','baobiao']
    };
  },
  methods: {
    logout() {
      this.$confirm("确定要退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type:'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem("token");
          this.$message.success("退出成功");
          this.$router.push('/login');
        })
        .catch(() => {});
    },
    async getMenuList () {
      const {data:ret} = await this.$http.get('menus');
      console.log(ret);
      this.menuList = ret.data;
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #363c40;
    padding: 0;
    height: 25px;
    display: flex;
    align-items: center;
    // 设置中间为空 两边对齐
    justify-content: space-between;
    padding-right: 20px;
    #logo-box {
      font-size: 20px;
      display: flex;
      // 垂直居中
      align-items: center;
      // 这是为不能被选中
      user-select: none;
      color: #fff;
      img {
        height: 50px;
        width: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #e9ecf0;
  }
}
</style>
