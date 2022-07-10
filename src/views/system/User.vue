<template>
  <div class="shadow">
    <div class="save-container">
      <div class="save-box">
        <el-button type="primary" size="small" plain icon="el-icon-plus" @click="adduser">添加用户</el-button>
      </div>
      <div class="close-box">
        <el-tooltip content="刷新数据" placement="bottom">
          <el-button type="success" size="small" plain circle icon="el-icon-refresh" @click="initUsers" />
        </el-tooltip>
      </div>
    </div>
    <el-table
        v-loading="loading"
        :data="users"
        :default-sort = "{prop: 'date', order: 'descending'}"
        style="width: 100%">
      <el-table-column
          prop="username"
          label="用户名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="nickname"
          label="名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="avatar"
          label="头像链接"
          width="300">
      </el-table-column>
      <el-table-column
          prop="email"
          label="电子邮箱"
          width="180">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话号码"
          width="180">
      </el-table-column>
      <el-table-column
          prop="gender"
          label="性别"
          width="55">
      </el-table-column>
      <el-table-column
          prop="loginAddress"
          label="登录地址"
          width="150">
      </el-table-column>
      <el-table-column
          prop="loginIp"
          label="登录IP"
          width="150">
      </el-table-column>
      <el-table-column
          label="登录日期"
          width="210">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="createUser"
          label="创建用户"
          width="150">
      </el-table-column>
      <el-table-column
          label="创建日期"
          width="210">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="updateUser"
          label="更新用户"
          width="150">
      </el-table-column>
      <el-table-column
          label="更新日期"
          width="210">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="150"
          align="center"
          label="禁用">
        <template slot-scope="scope">
          <el-switch disabled type="primary" v-model="scope.row.enabled"/>
        </template>
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注">
      </el-table-column>
      <el-table-column
          fixed="right"
          align="center"
          min-width="179px"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="upUser(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
        :title="userForm.id === null?'新增用户':'修改用户'"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">
      <div class="save-container">
        <el-form ref="userFormCheck" :model="userForm" :rules="rule" label-width="90px">
          <el-form-item label="用户账号" prop="username">
            <el-input size="small" v-model="userForm.username" placeholder="请输入用户账号..." />
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input size="small" type="password" v-model="userForm.password" placeholder="请输入用户密码..." />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input size="small" type="password" v-model="userForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="nickname">
            <el-input size="small" v-model="userForm.nickname" placeholder="请输入用户名称..." />
          </el-form-item>
          <el-form-item label="用户头像" prop="avatar">
            <el-input size="small" v-model="userForm.avatar" placeholder="请输入用户头像链接..." />
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input size="small" v-model="userForm.email" placeholder="请输入电子邮箱..." />
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input size="small" maxlength="11" v-model="userForm.phone" placeholder="请输入电话号码..." />
          </el-form-item>
          <el-form-item label="性别:" prop="gender">
            <el-radio-group v-model="userForm.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户禁用">
            <el-switch v-model="userForm.enabled" />
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" :rows="3" placeholder="请输入备注信息..." v-model="userForm.remark"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-sunny" size="small" type="success" @click="saveUser()">确定</el-button>
            <el-popconfirm
                v-if="userForm.id === null"
                style="margin-left: 10px"
                @confirm="clearForm"
                title="确定要重置菜单信息吗？">
              <el-button icon="el-icon-refresh" size="small" type="warning" plain slot="reference">重置</el-button>
            </el-popconfirm>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>

</template>

<script>
export default {
  name: "User",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userFormCheck.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      users: [],
      drawer: false,
      direction: 'rtl',
      loading: false,      //加载
      title: '',
      userForm: {
        id: null,
        username: '',
        password: '',
        checkPass: '',
        nickname: '',
        avatar: '',
        email: '',
        phone: '',
        gender: '男',
        enabled: false,
        delFlag: false,
        createUser: '',
        createTime: '',
        updateTime: '',
        updateUser: '',
        remark: '',
      },
      rule: {
        username: [{required: true, message: '请输入用户账号！', trigger: 'blur'}],
        nickname: [{required: true, message: '请输入用户名称！', trigger: 'blur'}],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        avatar: [{required: true, message: '请输入用户头像地址！', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱地址！', trigger: 'blur'},{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        phone: [{required: true, message: '请输入电话号码地址！', trigger: 'blur'}],
      },
    }
  },
  methods: {
    clearForm() {
      this.userForm = {
        id: null,
        username: '',
        password: '',
        checkPass: '',
        nickname: '',
        avatar: '',
        email: '',
        phone: '',
        gender: '男',
        enabled: false,
        delFlag: false,
        createUser: '',
        createTime: '',
        updateTime: '',
        updateUser: '',
        remark: '',
      }
    },
    saveUser() {
      this.$refs["userFormCheck"].validate(valid=>{
        if (valid) {
          if (this.userForm.id === null) {
            this.postRequest("/system/user/",this.userForm).then(resp=>{
              if (resp) {
                this.initUsers();
                this.drawer = false;
              }
            })
          } else {
            this.putRequest("/system/user/",this.userForm).then(resp=>{
              if (resp) {
                this.initUsers();
                this.drawer = false;
              }
            })
          }
        }
      })
    },
    handleClose(done) {
      this.$confirm('此界面数据不会临时保存，是否离开？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    adduser() {
      this.drawer = true;
      this.userForm = {
            id: null,
            username: '',
            password: '',
            checkPass: '',
            nickname: '',
            avatar: '',
            email: '',
            phone: '',
            gender: '男',
            enabled: true,
            delFlag: false,
            createUser: '',
            createTime: '',
            updateTime: '',
            updateUser: '',
            remark: ''
      }
    },
    upUser(user) {
      this.drawer = true;
      Object.assign(this.userForm,user);
    },
    deleteUser(user) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/user/?ids="+user.id).then(resp=>{
          if (resp) {
            this.initUsers();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    initUsers() {
      this.getRequest("/system/user/").then(resp=>{
        this.loading = true;
        if (resp) {
          this.users = resp;
          this.loading = false;
        }
      })
    }
  },
  mounted() {
    this.initUsers();
  }
}
</script>
<style scoped>
.save-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>