<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 搜索框加添加用户 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryParams.query"
            :clearable="true"
            @keyup.enter.native="getUsersInfo"
            @clear="getUsersInfo"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersInfo"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="addUsersInfomation = !addUsersInfomation"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表数据加载区 -->
      <el-table :data="usersListInfo" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号码"
          width="140"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="150"
        ></el-table-column>
        <el-table-column label="状态" width="70">
          <!-- 修改用户状态 -->
          <template slot-scope="info">
            <el-switch
              v-model="info.row.mg_state"
              @change="userStatus(info.row.id, info.row.mg_state)"
            ></el-switch>
          </template>
          <!-- 通过slot-scope给数据命名  info现在代表usersListInfo得数据  -->
        </el-table-column>
        <!-- 按钮 编辑 删除 分配角色 -->
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserInfo(info.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="editUserDelete(info.row.id, info.row.username)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="userAssignShow(info.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[2, 3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      >
      </el-pagination>
      <!-- 对话框框开始 -->
      <!-- 用户添加对话框 -->
      <template>
        <el-dialog
          title="添加用户"
          :visible.sync="addUsersInfomation"
          @close="addUserRest"
        >
          <el-form
            :model="addUser"
            status-icon
            ref="addUserRef"
            :rules="addUserRules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUser.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="addUser.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUser.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addUser.mobile"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addUsersInfomation = false">取 消</el-button>
            <el-button type="primary" @click="addUsersInfo">确 定</el-button>
          </div>
        </el-dialog>
      </template>
      <!-- 修改用户对话框 -->
      <template>
        <el-dialog
          title="修改用户"
          :visible.sync="editUserInfomation"
          @close="editUserRest"
        >
          <el-form
            :model="editUser"
            status-icon
            ref="editUserRef"
            :rules="editUserRules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="editUser.username"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editUser.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model.number="editUser.mobile"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editUserInfomation = false">取 消</el-button>
            <el-button type="primary" @click="editUsersInfo">确 定</el-button>
          </div>
        </el-dialog>
      </template>
      <!-- 分配角色对话框 -->
      <template>
        <el-dialog title="用户分配角色" :visible.sync="userAssignInfomarion" @close="fenpeiFormClose">
          <el-form :model="fenpeiForm" ref="fenpeiFormRef" :rules="fenpeiFormRules">
            <el-form-item label="当前用户:">{{fenpeiForm.username}}</el-form-item>
            <el-form-item label="分配新角色">
              <el-select v-model="fenpeiForm.rid" placeholder="请选择角色">
                <el-option v-for="item in fenpeiInfoList" :key="item.id" :value="item.id" :label="item.roleName"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="userAssignInfomarion = false">取 消</el-button>
          <el-button type="primary" @click="fenpeiRoles">确 定</el-button>
        </div>
      </el-dialog>
      </template>
      <!-- 对话框结束 -->
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersInfo();
  },
  data() {
    return {
      // 用于存放用户数据得数组
      usersListInfo: [],
      // 用于获取用户列表时得参数
      queryParams: {
        query: "",
        pagenum: 1, // 当前页
        pagesize: 2, // 当前页面多少条
        total: 0
      },
      // 用于显示对话框
      addUsersInfomation: false,
      editUserInfomation: false,
      userAssignInfomarion:false,
      // 添加用户
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            tirgger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            tirgger: "blur"
          }
        ]
      },
      // 编辑用户
      editUser: {
        username: "",
        region: "",
        email: "",
        mobile: ""
      },

      editUserRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            tirgger: "blur"
          }
        ],
        mobile: [
          // {
          //   type:'mobile',
          //   message:'手机号格式不正确',
          //   tirgger:'blur'
          // }
        ]
      },
      // 角色分配
      fenpeiForm: {
        username:'',
        rid:''
      },
      fenpeiInfoList:[],
      fenpeiFormRules:{
        ridRules:{
          required:true,
          message:'表单不能为空',
          trigger:'change'
        }
      }
    };
  },
  methods: {
    //   请求用户列表
    async getUsersInfo() {
      const { data: ret } = await this.$http.get("users", {
        params: this.queryParams
      });
      console.log(ret);

      if (ret.meta.status != 200) {
        return this.$message.error(ret.meta.msg);
      }

      this.usersListInfo = ret.data.users;

      this.queryParams.total = ret.data.total;
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.queryParams.pagesize = val;

      this.getUsersInfo();
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.queryParams.pagenum = val;

      this.getUsersInfo();
    },
    //   修改用户状态
    async userStatus(id, status) {
      const { data: ret } = await this.$http.put(`users/${id}/state/${status}`);
      if (ret.meta.status != 200) {
        return this.$message.error(ret.meta.msg);
      }
      this.$message({
        message: "修改状态成功",
        type: "success",
        duration: 1500
      });
    },
    // 关闭对话框重置form的内容
    addUserRest() {
      this.$refs.addUserRef.resetFields();
    },
    // 添加用户
    addUsersInfo() {
      this.$refs.addUserRef.validate(async valed => {
        if (valed) {
          const { data: ret } = await this.$http.post("users", this.addUser);
          console.log(ret);

          if (ret.meta.status != 201) {
            this.$message.error(ret.meta.msg);
          }

          this.getUsersInfo();
          this.$message.success(ret.meta.msg);
          this.addUsersInfomation = false;
        }
      });
    },
    // 关闭对话框后重置form的内容
    editUserRest() {
      this.$refs.editUserRef.resetFields();
    },
    // 获取要编辑用户得信息
    async editUserInfo(id) {
      this.editUserInfomation = true;
      const { data: ret } = await this.$http.get(`users/${id}`);
      console.log(ret);
      if (ret.meta.status != 200) {
        return this.$message.error(ret.meta.msg);
      }
      this.editUser = ret.data;
    },
    // 编辑用户
    editUsersInfo() {
      this.$refs.editUserRef.validate(async valed => {
        if (valed) {
          const { data: ret } = await this.$http.put(
            `users/${this.editUser.id}`,
            { email: this.editUser.email, mobile: this.editUser.mobile }
          );
          console.log(ret);
          if (ret.meta.status != 200) {
            return this.$message.error(ret.meta.msg);
          }
          this.getUsersInfo();
          this.editUserInfomation = false;
        }
      });
    },
    // 删除用户
    editUserDelete(id, username) {
      this.$confirm(`确定要删除用户名为[${username}]的用户吗？`, "提示", {
        confirmButtoText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: ret } = await this.$http.delete(`users/${id}`);
          console.log(ret);
          if (ret.meta.status != 200) {
            return this.$message.error(ret.meta.msg);
          }
          this.$message.success("删除用户成功");
          // 如果当前页数据等于1条时 并且 当前页码大于1时
          if(this.usersListInfo.length == 1 && this.queryParams.pagenum > 1){
            // 到上一页
            this.queryParams.pagenum --;
          }
          this.getUsersInfo();
        })
        .catch(() => {});
    },
    // 设置分配角色
    async userAssignShow(id) {
      this.userAssignInfomarion = true;
      const {data:ret} = await this.$http.get(`users/${id}`);
      console.log(ret);
      if(ret.meta.status != 200) {
        return this.$message.error(ret.meta.msg);
      }
      this.fenpeiForm = ret.data;
      console.log(this.fenpeiForm);

      const {data:res} = await this.$http.get('roles')
      console.log(res);
      this.fenpeiInfoList = res.data;
      console.log(this.fenpeiInfoList)
    },
    // 关闭后重置表单
    fenpeiFormClose() {
      this.$refs.fenpeiFormRef.resetFields()
    },
    // 分配角色功能
    async fenpeiRoles() {
      const {data:ret} = await this.$http.put('users/'+this.fenpeiForm.id+'/role',this.fenpeiForm)
      console.log('数据'+ret);
      if(ret.meta.status != 200) {
        return this.$message.error(ret.meta.msg)
      }
      this.$message.success(ret.meta.msg);
      this.userAssignInfomarion = false;
      this.getUsersInfo();
    }

  }
};
</script>

<style lang="less" scoped></style>
