<template>
  <div class="animate__animated animate__fadeIn">
    <el-card>
      <div class="search-container">
          <el-button :disabled="deleteList.length === 0" slot="reference" icon="el-icon-delete" type="danger" @click="deleteMany" size="small">批量删除
          </el-button>
        <div class="search-box">
          <el-input v-model="keywords" prefix-icon="el-icon-search" placeholder="请输入用户名称..." size="small" style="margin-right: 10px"/>
          <el-button icon="el-icon-search" type="primary" size="small" @click="doSearch">搜索</el-button>
        </div>
      </div>
      <!--表格部分-->
    <el-table
        @selection-change="selectionChange"
        ref="multipleTable"
        v-loading="loading"
        :data="logList"
        tooltip-effect="dark"
        style="width: 100%">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          align="center"
          prop="username"
          label="用户名"
          min-width="100">
      </el-table-column>
      <el-table-column
          align="center"
          prop="nickname"
          label="用户名称"
          min-width="150">
      </el-table-column>
      <el-table-column
          align="center"
          prop="ipAddress"
          label="登陆ip地址"
          width="150">
      </el-table-column>
      <el-table-column
          align="center"
          prop="ipSource"
          label="登陆ip所在地"
          width="260">
      </el-table-column>
      <el-table-column
          align="center"
          prop="browser"
          label="浏览器"
          width="90">
      </el-table-column>
      <el-table-column
          align="center"
          prop="os"
          label="操作系统"
          width="90">
      </el-table-column>
      <el-table-column
          align="center"
          label="状态"
          width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 1">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="remark"
          label="操作信息"
          min-width="100">
      </el-table-column>
      <el-table-column
          align="center"
          prop="gmtCreate"
          label="登陆时间"
          width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          {{ scope.row.loginTime }}
        </template>
      </el-table-column>
    </el-table>
    <!--分页部分-->
      <el-pagination
          class="page"
          @size-change="sizeChange"
          @current-change="currentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "LoginLog",
  data() {
    return {
      keywords: '',
      loading: false,
      logList: [],
      deleteList: [],
      total: 0,
      size: 10,
      page: 1,
    }
  },
  methods: {
    doSearch() {
      this.initLoginLog();
    },
    deleteMany() {
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.deleteList.forEach(item=>{
          ids += 'ids='+item.id + '&'
        })
        this.deleteRequest("/log/LoginLog/"+ids).then(resp=>{
          if (resp) {
            this.page = 1;
            this.initLoginLog();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    selectionChange(val) {
     this.deleteList = val
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initLoginLog();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initLoginLog();
    },
    initLoginLog() {
      this.loading = true;
      let url = '/log/LoginLog/?page=' + this.page + '&size=' + this.size + '&keywords=' + this.keywords;
      this.getRequest(url).then(resp=>{
        this.loading = false;
        if (resp) {
          this.logList = resp.data;
          this.total = resp.total;
        }
      })
    }
  },
  mounted() {
    this.initLoginLog()
  }
}
</script>

<style scoped>
.el-table__header-wrapper th {
  background-color: #f0f1ff;
}

.el-table__body-wrapper::-webkit-scrollbar {
  /* width: 0;宽度为0隐藏 */
  width: 0px;
  height: 0;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 0;
  background: #fff;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  box-shadow: none;
  border-radius: 0;
  background: #fff;
}

.search-container {
  display: flex;
  justify-content: space-between;
}


.search-box {
  display: flex;
  justify-content: right;
}


.main-container {
  margin-left: 100px;
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.opt {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.request {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.requestParam{
  margin-top: 10px;
  display: flex;
  justify-content: left;
}

.response {
  margin-top: 10px;
  display: flex;
  justify-content: left;
}

.time {
  margin-top: 10px;
  display: flex;
  justify-content: right;
}

.title {
  white-space : nowrap;
  font-size: 14px;
  font-weight: bolder;
  color: #333416;
}

.page {
  margin-top: 10px;
  display: flex;
  justify-content: right;
}
</style>
