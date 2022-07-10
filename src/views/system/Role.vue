<template>
  <div class="shadow">
    <div class="save-container">
      <div class="save-box">
        <el-button type="primary" size="small" plain icon="el-icon-plus" @click="addRole">添加角色</el-button>
      </div>
      <div class="close-box">
        <el-tooltip content="刷新数据" placement="bottom">
          <el-button type="success" size="small" plain circle icon="el-icon-refresh" @click="initRoles"/>
        </el-tooltip>
      </div>
    </div>
    <el-table
        v-loading="loading"
        :default-sort = "{prop: 'date', order: 'descending'}"
        :data="roles"
        style="width: 100%">
      <el-table-column
          prop="name"
          label="名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述"
          width="180">
      </el-table-column>
      <el-table-column
          sortable
          :formatter="formatter"
          prop="num"
          label="排序"
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
          <el-button type="text" icon="el-icon-edit" @click="upRole(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
        :title="roleForm.id === null?'新增角色':'修改角色'"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">
      <div class="save-container">
        <el-form ref="roleFormCheck" :model="roleForm" :rules="rule" label-width="90px">
          <el-form-item label="角色名称" prop="name">
              <el-input size="small" v-model="roleForm.name" placeholder="请输入角色名称..." />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
              <el-input size="small" v-model="roleForm.description" placeholder="请输入角色描述..." />
          </el-form-item>
          <el-form-item label="角色排序">
            <el-input-number size="small" v-model="roleForm.num" controls-position="right" :min="0" :max="99"></el-input-number>
          </el-form-item>
          <el-form-item label="角色禁用">
            <el-switch v-model="roleForm.enabled" />
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" :rows="3" placeholder="请输入备注信息..." v-model="roleForm.remark"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-sunny" size="small" type="success" @click="saveRole()">确定</el-button>
            <el-popconfirm
                v-if="roleForm.id === -1"
                style="margin-left: 10px"
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
  name: "Role",
  data() {
    return {
      roles: [],
      drawer: false,
      direction: 'rtl',
      loading: false,      //加载
      title: '',
      roleForm: {
        id: null,
        name: '',
        description: '',
        num: '',
        enabled: false,
        delFlag: false,
        createUser: '',
        createTime: '',
        updateTime: '',
        updateUser: '',
        remark: '',
      },
      rule: {
        name: [{required: true, message: '角色名称不能为空！', trigger: 'blur'}],
        description: [{required: true, message: '角色描述不能为空！', trigger: 'blur'}],
      },
    }
  },
  methods: {
    saveRole() {
      this.$refs["roleFormCheck"].validate(valid=>{
        if (valid) {
          if (this.roleForm.id === null) {
            this.postRequest("/system/role/",this.roleForm).then(resp=>{
              if (resp) {
                this.initRoles();
                this.drawer = false;
              }
            })
          } else {
            this.putRequest("/system/role/",this.roleForm).then(resp=>{
              if (resp) {
                this.initRoles();
                this.drawer = false;
              }
            })
          }
        }
      })
    },
    addRole() {
      this.drawer = true;
      this.roleForm = {
        id: null,
        name: '',
        description: '',
        num: '',
        enabled: true,
        delFlag: false,
        createUser: '',
        createTime: '',
        updateTime: '',
        updateUser: '',
        remark: '',
      }
    },
    upRole(data) {
      this.drawer = true;
      Object.assign(this.roleForm,data);
    },
    formatter(row, column) {
      return row.num;
    },
    deleteRole(row) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.deleteRequest("/system/role/?ids="+row.id).then(resp=>{
            if (resp) {
              this.initRoles();
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    handleClose(done) {
      this.$confirm('此界面数据不会临时保存，是否离开？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    initRoles() {
      this.loading = true;
      this.getRequest("/system/role/").then(resp=>{
        if (resp) {
          this.roles = resp;
          this.loading = false;
        }
      })
    }
  },
  mounted() {
    this.initRoles();
  }
}
</script>

<style>
.el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.save-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
