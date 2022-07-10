<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <div>
        <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{user.nickname}}<el-avatar :src="user.avatar"></el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '61px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu v-if="item.children" :index="index + ''" v-for="(item,index) in menus" :key="index">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="child.path" v-for="(child,indek) in item.children" :key="indek">
              <template slot="title">
                <!-- 二级菜单的模板区域 -->
                <i :class="child.icon"></i>
                <!-- 图标 -->
                <span>{{ child.name }}</span>
                <!-- 文本 -->
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-if="!ite.children" :index="ite.path" v-for="(ite,indes) in menus" :key="indes">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="ite.icon"></i>
              <!-- 文本 -->
              <span>{{ ite.name }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="navList">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$router.currentRoute.path != '/home'">{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false, // 是否折叠属性
      // user: JSON.parse(window.sessionStorage.getItem("user"))
    }
  },
  computed: {
    menus() {
      return this.$store.state.menus;
    },
    user() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    commandHandler(cmd) {
      if (cmd === 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/logout");
          window.sessionStorage.removeItem("user");
          this.$store.commit("initMenus",[])
          this.$router.replace("/")
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
    }
  },
}
</script>

<style scoped>
.navList {
  margin: -19px -15px 10px -15px;
  display: flex;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  height: 33px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  align-items: center;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #fff;
}
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  background-color: #373d3f;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
span {
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
}
.el-menu {
  border-right: none;
}
.iconfont {
  padding-right: 10px;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.shadow {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  color: #303133;
  transition: .3s;
  padding: 20px;
}
</style>
