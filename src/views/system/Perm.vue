<template>
    <el-tabs type="border-card">
      <el-tab-pane label="角色管理">
        <el-collapse v-model="activeName" accordion @change="change">
          <el-collapse-item :title="u.nickname" :name="u.id" v-for="(u,index) in users" :key="index">
            <el-card class="box-card">
                <el-tree
                    node-key="id"
                    ref="tree"
                    :default-checked-keys="selectedRoles"
                    show-checkbox
                    :key="index"
                    :data="allRole"
                    :props="defaultProps">
                </el-tree>
                <div style="display: flex;justify-content: flex-end">
                  <el-button size="small" @click="cancelUpRole">取消修改</el-button>
                  <el-button type="primary" size="small" @click="doUpRole(u.id,index)">确认修改</el-button>
                </div>
            </el-card>
        </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="菜单管理">
        <el-collapse v-model="active" accordion  @change="changes">
          <el-collapse-item :title="r.name" :name="r.id" v-for="(r,indej) in roles" :key="indej">
            <el-card class="box-card">
              <el-tree
                  node-key="id"
                  ref="tres"
                  :default-checked-keys="selectedMenus"
                  show-checkbox
                  :key="indej"
                  :data="allMenu"
                  :props="defaultProps">
              </el-tree>
              <div style="display: flex;justify-content: flex-end">
                <el-button size="small" @click="cancelUpMenu">取消修改</el-button>
                <el-button type="primary" size="small" @click="doUpMenu(r.id,indej)">确认修改</el-button>
              </div>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
  name: "Perm",
  data() {
    return {
      activeName: -1,
      active: -1,
      users: [],
      roles: [],
      selectedRoles: [],
      selectedMenus: [],
      allMenu: [],
      allRole: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    initUsers() {
      this.getRequest("/system/user/").then(resp=>{
        if (resp) {
          this.users = resp;
        }
      })
    },
    initAllRole() {
      this.getRequest("/system/role/").then(resp=>{
        if (resp) {
          this.allRole = resp;
        }
      })
    },
    initRoles() {
      this.getRequest("/system/role/").then(resp=>{
        if (resp) {
          this.roles = resp;
        }
      })
    },
    initMenus() {
      this.getRequest("/system/menu/").then(resp=>{
        if (resp) {
          this.allMenu = resp;
        }
      })
    },
    change(uid) {
      this.selectedRoles = []
      if (uid) {
        this.initAllRole();
        this.initSelectedUsers(uid)
      }
    },
    changes(rid) {
      this.selectedMenus = []
      if (rid) {
        this.initMenus();
        this.initSelectedRoles(rid)
      }
    },
    initSelectedUsers(uid) {
      this.getRequest("/system/perm/ur/"+uid).then(resp=>{
        if (resp) {
          this.selectedRoles = resp;
        }
      })
    },
    initSelectedRoles(rid) {
      this.getRequest("/system/perm/mr/"+rid).then(resp=>{
        if (resp) {
          this.selectedMenus = resp;
        }
      })
    },
    cancelUpRole() {
      this.activeName = -1;
    },
    cancelUpMenu() {
      this.activeName = -1;
    },
    doUpRole(uid,index) {
      let tree = this.$refs.tree[index];
      let keys = tree.getCheckedKeys(true);
      let url = '/system/perm/ur/?uid='+uid;
      keys.forEach(key=>{
        url+='&rids=' + key;
      })
      this.putRequest(url).then(resp=>{
        if (resp) {
          this.activeName = -1;
        }
      })
    },
    doUpMenu(rid,indej) {
      let tres = this.$refs.tres[indej];
      let keys = tres.getCheckedKeys(true);
      let url = '/system/perm/mr/?rid='+rid;
      keys.forEach(key=>{
        url+='&mids=' + key;
      })
      this.putRequest(url).then(resp=>{
        if (resp) {
          this.active = -1;
        }
      })
    },
  },
  mounted() {
    this.initUsers()
    this.initRoles()
  },

}
</script>

<style scoped>

</style>
