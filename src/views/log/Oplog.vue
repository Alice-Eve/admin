<template>
  <div class="animate__animated animate__fadeIn">
    <el-card>
      <div class="search-container">
          <el-button :disabled="deleteList.length === 0" slot="reference" icon="el-icon-delete" type="danger" @click="deleteMany" size="small">批量删除
          </el-button>
        <div class="search-box">
          <el-input v-model="keywords" prefix-icon="el-icon-search" placeholder="请输入操作模块名称..." size="small" style="margin-right: 10px"/>
          <el-button icon="el-icon-search" type="primary" size="small" @click="doSearch">搜索</el-button>
        </div>
      </div>
      <el-table
          @selection-change="selectionChange"
          max-height="650"
          v-loading="loading"
          :data="optLogList"
          style="width: 100%;margin-top: 20px ">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="main-container">
              <div class="opt">
                <div>
                  <span class="title">操作模块：</span>
                  <span class="content">{{ scope.row.title }}</span>
                </div>
                <div>
                  <span class="title">请求地址：</span>
                  <span class="content">{{ scope.row.optUrl }}</span>
                </div>
              </div>
              <div class="request">
                <div>
                  <span class="title">请求方式：</span>
                  <span class="content">{{ scope.row.requestType }}</span>
                </div>
                <div>
                  <span class="title">操作时间：</span>
                  <span class="content">{{ scope.row.optTime }}</span>
                </div>
              </div>
              <div class="requestParam">
                <span class="title">请求参数：</span>
                <span class="content">{{ scope.row.requestParam }}</span>
              </div>
              <div class="response">
                <span class="title">返回参数：</span>
                <span class="content">{{ scope.row.responseData }}</span>
              </div>
              <div class="time">
                <span class="title">操作员：</span>
                <span class="content">{{ scope.row.optName }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            width="110"
            label="操作模块"
            prop="title">
        </el-table-column>
        <el-table-column
            align="center"
            width="50"
            label="类型"
            prop="businessType">
        </el-table-column>
        <el-table-column
            align="center"
            min-width="130"
            label="方法描述"
            prop="methodName">
        </el-table-column>
        <el-table-column
            align="center"
            width="90"
            label="请求方式"
            prop="requestType">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.requestType === 'GET'" type="success">GET</el-tag>
            <el-tag v-if="scope.row.requestType === 'POST'" type="success">POST</el-tag>
            <el-tag v-if="scope.row.requestType === 'PUT'" type="primary">PUT</el-tag>
            <el-tag v-if="scope.row.requestType === 'DELETE'" type="danger">DELETE</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140"
            label="操作员"
            prop="optName">
        </el-table-column>
        <el-table-column
            align="center"
            width="125"
            label="操作员ip"
            prop="optIp">
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140"
            label="操作员地址"
            prop="optAddress">
        </el-table-column>
        <el-table-column
            align="center"
            width="210"
            label="操作日期"
            prop="optTime">
          <template slot-scope="scope">
            <i class="el-icon-time"/>{{ scope.row.optTime }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="80"
            label="操作">
          <template slot-scope="scope">
            <el-popconfirm
                title="确定要删除本条日志信息吗？">
              <el-button @click="deleteLog(scope.row)" type="warning" size="mini" slot="reference" plain>删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
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
  name: "Oplog.vue",
  data() {
    return {
      keywords: '',
      loading: false,
      optLogList: [],
      deleteList: [],
      total: 0,
      size: 10,
      page: 1,
    }
  },
  methods: {
    doSearch() {
      this.initOplog();
    },
    deleteLog(row) {
      this.$confirm('此操作将永久删除该日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/log/oplog/?ids="+row.id).then(resp=>{
          if (resp) {
            this.initOplog();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
        this.deleteRequest("/log/oplog/"+ids).then(resp=>{
          if (resp) {
            this.page = 1;
            this.initOplog();
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
      this.initOplog();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initOplog();
    },
    initOplog() {
      this.loading = true;
      let url = '/log/oplog/?page=' + this.page + '&size=' + this.size + '&keywords=' + this.keywords;
      this.getRequest(url).then(resp=>{
        this.loading = false;
        if (resp) {
          this.optLogList = resp.data;
          this.total = resp.total;
        }
      })
    }
  },
  mounted() {
    this.initOplog()
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
