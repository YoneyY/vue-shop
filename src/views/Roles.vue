<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-row>
                <el-button type="primary" @click="addRolesInfomation = true">添加角色</el-button>
            </el-row>
            <el-row>
                <el-table :data="getRolesList" border style="width:100%">
                    <el-table-column type="expand">
                        <template slot-scope="info">
                            <el-row v-for="(item,i) in info.row.children" :key="item.id" 
                            :style="{'border-bottom':'1px solid #ebedf5','border-top':i === 0 ? '1px solid #ebedf5':''}"
                            >
                                <!-- 第一级 -->
                                <el-col :span="5">
                                    <el-tag closable>{{item.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="19">
                                    <!-- 第二级 -->
                                    <el-row v-for="(item2,ii) in item.children" :key="item2.id" 
                                    :style="{'border-top' : ii !== 0 ? '1px solid #ebedf5':''}"
                                    >
                                        <el-col :span="6">
                                            <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <!-- 第三级 -->
                                        <el-col :span="18">
                                            <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="roleName" label="角色名称"></el-table-column>
                    <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
                    <el-table-column label="操作" width="330">
                        <template slot-scope="info">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editGetRolesInfo(info.row.id)">编辑</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="rolesInfoDelete(info.row.id,info.row.roleName)">删除</el-button>
                            <el-button type="warning" size="mini" icon="el-icon-setting" @click="getRolesInfoList">分配权限</el-button>
                        </template>
                            
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>
        <!-- 对话框开始 -->
        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRolesInfomation">
            <el-form :model="rolesFormInfo" status-icon :rules="addRolesRules" ref="addRolesRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="rolesFormInfo.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="rolesFormInfo.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRolesInfomation = false">取 消</el-button>
                <el-button type="primary" @click="addRolesInfo">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRolesInfomation">
            <el-form :model="editrolesFormInfo" status-icon :rules="editRolesRules" ref="editRolesRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editrolesFormInfo.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editrolesFormInfo.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRolesInfomation = false">取 消</el-button>
                <el-button type="primary" @click="editRolesInfo">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog title="角色分配" :visible.sync="fenpeiRolesInfomation">
            <el-tree
            :data="fenpeiRolesList"
            :props="fenpeiRolesLabel"
            show-checkbox
            node-key="id"
            >

            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="fenpeiRolesInfomation = false">取 消</el-button>
                <el-button type="primary" @click="fenpeiRolesInfomation = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 对话框结束 -->
    </div>
</template>

<script>
export default {
    created() {
        this.getRolesInfo();
    },
    data() {
        return {
            // 用于存放角色列表
            getRolesList:[],
            // 弹出框
            addRolesInfomation:false,
            editRolesInfomation:false,
            fenpeiRolesInfomation:false,
            // 添加角色
            rolesFormInfo:{
                roleName:'',
                roleDesc:''
            },
            addRolesRules:{
                roleName:[
                    {
                        required:true,
                        message:'角色名不能为空',
                        trigger:'blur'
                    }
                ]
            },
            // 编辑角色
            editrolesFormInfo:{
                roleName:'',
                roleDesc:''
            },
            editRolesRules:{
                roleName:[
                    {
                        required:true,
                        message:'角色名不能为空',
                        trigger:'blur'
                    }
                ]
            },
            // 分配角色
            fenpeiRolesList:[],
            fenpeiRolesLabel:{
                label:'authName',// 每一项名称
                children:'children' // 子项
            }
        }
    },
    methods: {
        // 请求角色列表
        async getRolesInfo () {
            const {data:ret} = await this.$http.get('roles');
            console.log(ret);
            this.getRolesList = ret.data
        },
        // 添加角色
        addRolesInfo() {
            this.$refs.addRolesRef.validate(async valed=>{
                if(valed){
                    const {data:ret} = await this.$http.post('roles',this.rolesFormInfo);
                    console.log(ret);
                    if(ret.meta.status != 201) {
                        return this.$message.error(ret.meta.msg);
                    }
                    this.$message.success(ret.meta.msg);
                    this.getRolesInfo();
                    this.addRolesInfomation = false;
                }
            })
            
        },
        // 删除角色
        rolesInfoDelete(id,rolesName) {
            this.$confirm(`确定要删除角色名为[${rolesName}]的角色吗？`,'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(async ()=>{
                const {data:ret} = await this.$http.delete(`roles/${id}`);
                console.log(ret);
                if(ret.meta.status != 200) {
                    return this.$message.error(ret.meta.msg);
                }
                this.$message.success(ret.meta.msg)
                this.getRolesInfo();
            }).catch(()=>{})
        },
        // 打开对话框并获取要编辑的角色
        async editGetRolesInfo(id) {
            this.editRolesInfomation = true
            const {data:ret} = await this.$http.get(`roles/${id}`);
            console.log(ret);
            if(ret.meta.status != 200){
                return this.$message.error(ret.meta.msg);
            }
            this.editrolesFormInfo = ret.data;   
            // console.log(this.editrolesFormInfo)
        },
        // 编辑角色
        editRolesInfo() {
            this.$refs.editRolesRef.validate(async valed=>{
                if(valed) {
                    const {data:ret} = await this.$http.put(`roles/${this.editrolesFormInfo.roleId}`,this.editrolesFormInfo);
                    console.log(ret);
                    if(ret.meta.status != 200) {
                        return this.$message.error(ret.meta.msg);
                    }
                    this.$message.success('编辑角色成功');
                    this.editRolesInfomation = false;
                    this.getRolesInfo();
                }
            })
        },
        // 获取角色权限 type=tree
        async getRolesInfoList() {
            this.fenpeiRolesInfomation=true;
            const {data:ret} = await this.$http.get('rights/tree');
            console.log(ret);
            if(ret.meta.status != 200) {
                return this.$message.error('获取数据失败');
            }
            this.fenpeiRolesList = ret.data;
        }
    },
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 10px 5px;
}
.el-row{
    display: flex;
    align-items: center;
}
</style>
