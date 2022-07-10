<template>
  <div class="animate__animated animate__fadeIn">
    <el-card>
      <!--查询部分-->
      <div class="top-container">
        <!--搜索部分-->
        <!--添加部分-->
        <div class="save-container">
          <!--添加-->
          <div class="save-box">
            <el-button type="primary" size="small" plain icon="el-icon-plus" @click="addMenu">添加菜单</el-button>
          </div>
          <!--刷新-->
          <div class="close-box">
            <el-tooltip content="刷新数据" placement="bottom">
              <el-button type="success" size="small" plain circle icon="el-icon-refresh" @click="initMenus" />
            </el-tooltip>
          </div>
        </div>
      </div>
      <!--数据部分-->
      <el-table
          :data="menus"
          v-loading="loading"
          row-key="id"
          ref="MenuTable"
          style="width: 100%;margin-top: 10px">
        <el-table-column
            prop="name"
            label="菜单名称"
            width="120">
        </el-table-column>
        <el-table-column
            align="center"
            label="图标"
            width="50">
          <template slot-scope="scope">
            <el-icon :class="scope.row.icon"/>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="orderNum"
            width="50"
            label="排序">
        </el-table-column>
        <el-table-column
            align="center"
            prop="path"
            width="170"
            label="路由地址">
        </el-table-column>
        <el-table-column
            align="center"
            prop="url"
            width="170"
            label="路径">
        </el-table-column>
        <el-table-column
            align="center"
            prop="component"
            min-width="200"
            label="组件名称">
        </el-table-column>
        <el-table-column
            align="center"
            width="70"
            label="隐藏">
          <template slot-scope="scope">
            <el-switch disabled type="primary" v-model="scope.row.hide"/>
          </template>
        </el-table-column>
        <el-table-column
            width="70"
            align="center"
            label="禁用">
          <template slot-scope="scope">
            <el-switch disabled type="primary" v-model="scope.row.enabled"/>
          </template>
        </el-table-column>
        <el-table-column
            min-width="140"
            align="center"
            prop="createUser"
            label="创建人">
        </el-table-column>
        <el-table-column
            align="center"
            width="180"
            label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="updateUser"
            min-width="140"
            label="修改人">
        </el-table-column>
        <el-table-column
            align="center"
            width="180"
            label="修改时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="remark"
            min-width="180"
            label="备注信息">
        </el-table-column>
        <el-table-column
            fixed="right"
            align="center"
            min-width="179px"
            label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="toUpMenu(scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--新增 弹出层-->
    <el-drawer
        :title="menuForm.id === null?'新增菜单':'修改菜单'"
        :before-close="handleClose"
        :visible.sync="drawer"
        append-to-body
        direction="rtl"
        size="28%">
      <div class="save-container">
        <el-form ref="menuFormCheck" :rules="rule" :model="menuForm" label-width="90px" class="demo-ruleForm">
          <el-form-item label="菜单父类">
            <el-select v-model="menuForm.parentId" placeholder="默认一级菜单">
              <el-option
                  v-for="item in menus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称" prop="name">
            <el-input border label="menu" v-model="menuForm.name"
                      placeholder="请输入菜单名称..."/>
          </el-form-item>
          <el-form-item label="菜单路由" prop="path">
            <el-input v-model="menuForm.path" border label="menu" placeholder="请输入菜单路由..."/>
          </el-form-item>
          <el-form-item label="菜单路径" prop="url">
            <el-input v-model="menuForm.url" border label="menu" placeholder="请输入菜单路径..."/>
          </el-form-item>
          <el-form-item label="菜单组件" prop="component">
            <el-input v-model="menuForm.component" border label="menu" placeholder="请输入菜单组件..."/>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon" >
            <el-autocomplete
                style="width: 100%"
                :prefix-icon="menuForm.icon"
                v-model="menuForm.icon"
                :fetch-suggestions="querySearch"
                value-key="dictCode"
                value="dictCode"
                placeholder="请选择图标...">
              <template slot-scope="{ item }">
                <div style="display: flex;justify-content: left;font-size: 15px;line-height: 35px">
                  <el-icon :class="item.dictCode" style="margin-right: 10px;line-height: 35px"/>
                  <span>{{ item.dictCode }}</span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="菜单排序">
            <el-input-number size="small" v-model="menuForm.orderNum" />
          </el-form-item>
          <el-form-item label="菜单隐藏">
            <el-switch v-model="menuForm.hide"/>
          </el-form-item>
          <el-form-item label="菜单禁用">
            <el-switch v-model="menuForm.enabled"/>
          </el-form-item>
          <el-form-item align="center">
            <el-button icon="el-icon-sunny" size="small" type="success" plain @click="saveMenu">
              确定
            </el-button>
            <el-popconfirm
                style="margin-left: 10px"
                title="确定要重置菜单信息吗？"
                @confirm="clearForm">
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
  name: "Menu",
  data() {
    return {
      menus: [],
      loading: false,      //加载
      drawer: false,
      iconList:[
        {
          "dictId": 8,
          "dictName": "饿了吗",
          "dictValue": "",
          "dictCode": "el-icon-platform-eleme",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 9,
          "dictName": "饿了吗",
          "dictValue": null,
          "dictCode": "el-icon-eleme",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 10,
          "dictName": "删除",
          "dictValue": null,
          "dictCode": "el-icon-delete-solid",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 11,
          "dictName": "删除",
          "dictValue": null,
          "dictCode": "el-icon-delete",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 12,
          "dictName": "设置",
          "dictValue": null,
          "dictCode": "el-icon-s-tools",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 13,
          "dictName": "设置",
          "dictValue": null,
          "dictCode": "el-icon-setting",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 14,
          "dictName": "用户",
          "dictValue": null,
          "dictCode": "el-icon-user-solid",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 15,
          "dictName": "用户",
          "dictValue": null,
          "dictCode": "el-icon-user",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 16,
          "dictName": "电话",
          "dictValue": null,
          "dictCode": "el-icon-phone",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 17,
          "dictName": "电话",
          "dictValue": null,
          "dictCode": "el-icon-phone-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 18,
          "dictName": "更多",
          "dictValue": null,
          "dictCode": "el-icon-more",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 19,
          "dictName": "星星",
          "dictValue": null,
          "dictCode": "el-icon-star-on",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 20,
          "dictName": "星星",
          "dictValue": null,
          "dictCode": "el-icon-star-off",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 21,
          "dictName": "购物",
          "dictValue": null,
          "dictCode": "el-icon-s-goods",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 22,
          "dictName": "购物",
          "dictValue": null,
          "dictCode": "el-icon-goods",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 23,
          "dictName": "警告",
          "dictValue": null,
          "dictCode": "el-icon-warning",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 24,
          "dictName": "感叹号",
          "dictValue": null,
          "dictCode": "el-icon-warning-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 25,
          "dictName": "问号",
          "dictValue": null,
          "dictCode": "el-icon-question\n",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 26,
          "dictName": "信息",
          "dictValue": null,
          "dictCode": "el-icon-info",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 27,
          "dictName": "缩小",
          "dictValue": null,
          "dictCode": "el-icon-remove\n",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 28,
          "dictName": "放大",
          "dictValue": null,
          "dictCode": "el-icon-circle-plus",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 29,
          "dictName": "正确",
          "dictValue": null,
          "dictCode": "el-icon-success",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 30,
          "dictName": "错误",
          "dictValue": null,
          "dictCode": "el-icon-error",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 31,
          "dictName": "放大",
          "dictValue": null,
          "dictCode": "el-icon-zoom-in",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 32,
          "dictName": "缩小",
          "dictValue": null,
          "dictCode": "el-icon-zoom-out",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 33,
          "dictName": "删除",
          "dictValue": null,
          "dictCode": "el-icon-remove-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 34,
          "dictName": "新增",
          "dictValue": null,
          "dictCode": "el-icon-circle-plus-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 35,
          "dictName": "查看",
          "dictValue": null,
          "dictCode": "el-icon-circle-check\n",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 36,
          "dictName": "关闭",
          "dictValue": null,
          "dictCode": "el-icon-circle-close",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 37,
          "dictName": "帮助",
          "dictValue": null,
          "dictCode": "el-icon-s-help",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 38,
          "dictName": "帮助",
          "dictValue": null,
          "dictCode": "el-icon-help",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 39,
          "dictName": "减号",
          "dictValue": null,
          "dictCode": "el-icon-minus",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 40,
          "dictName": "加号",
          "dictValue": null,
          "dictCode": "el-icon-plus",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 41,
          "dictName": "对号",
          "dictValue": null,
          "dictCode": "el-icon-check",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 42,
          "dictName": "差号",
          "dictValue": null,
          "dictCode": "el-icon-close",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 43,
          "dictName": "图片",
          "dictValue": null,
          "dictCode": "el-icon-picture",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 44,
          "dictName": "图片",
          "dictValue": null,
          "dictCode": "el-icon-picture-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 45,
          "dictName": "圆图片",
          "dictValue": null,
          "dictCode": "el-icon-picture-outline-round",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 46,
          "dictName": "上传",
          "dictValue": null,
          "dictCode": "el-icon-upload",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 47,
          "dictName": "上传",
          "dictValue": null,
          "dictCode": "el-icon-upload2",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 48,
          "dictName": "下载",
          "dictValue": null,
          "dictCode": "el-icon-download",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 49,
          "dictName": "照相机",
          "dictValue": null,
          "dictCode": "el-icon-camera-solid",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 51,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-video-camera-solid",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 52,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-video-camera",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 53,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-message-solid",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 54,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-bell",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 55,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-cooperation",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 56,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-order",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 57,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-platform",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 58,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-fold",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 59,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-unfold",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 60,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-operation",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 61,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-promotion",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 62,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-home",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 63,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-release",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 64,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-ticket",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 65,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-management",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 66,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-open",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 67,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-shop",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 68,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-marketing",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 69,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-flag",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 70,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-comment",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 71,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-finance",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 72,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-claim",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 73,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-custom",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 74,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-opportunity",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 75,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-data",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 76,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-check",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 77,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-s-grid",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 78,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-menu",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 79,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-share",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 80,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-d-caret",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 81,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-caret-left",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 82,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-caret-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 83,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-caret-bottom",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 84,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-caret-top",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 85,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-bottom-left",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 86,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-bottom-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 87,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-back",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 88,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 89,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-bottom",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 90,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-top",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 91,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-top-left",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 92,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-top-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 93,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-arrow-left",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 94,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-arrow-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 95,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-arrow-down",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 96,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-arrow-up",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 97,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-d-arrow-left",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 98,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-d-arrow-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 99,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-video-pause",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 100,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-video-play",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 101,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-refresh",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 102,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-refresh-right",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 103,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-refresh-left",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 104,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-finished",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 105,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-sort",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 106,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-sort-up",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 107,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-sort-down",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 108,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-rank",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 109,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-loading",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 110,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-view",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 111,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-c-scale-to-original",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 112,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-date",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 113,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-edit",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 114,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-edit-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 115,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-folder",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 116,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-folder-opened",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 117,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-folder-add",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 118,
          "dictName": null,
          "dictValue": null,
          "dictCode": "el-icon-folder-remove",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 121,
          "dictName": "el-icon-folder-delete",
          "dictValue": null,
          "dictCode": "el-icon-folder-delete",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 122,
          "dictName": "el-icon-folder-checked",
          "dictValue": null,
          "dictCode": "el-icon-folder-checked",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 123,
          "dictName": "el-icon-tickets",
          "dictValue": null,
          "dictCode": "el-icon-tickets",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 124,
          "dictName": "el-icon-document-remove",
          "dictValue": null,
          "dictCode": "el-icon-document-remove",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 125,
          "dictName": "el-icon-document-delete",
          "dictValue": null,
          "dictCode": "el-icon-document-delete",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 126,
          "dictName": "el-icon-document-copy",
          "dictValue": null,
          "dictCode": "el-icon-document-copy",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 127,
          "dictName": "el-icon-document-checked",
          "dictValue": null,
          "dictCode": "el-icon-document-checked",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 128,
          "dictName": "el-icon-document",
          "dictValue": null,
          "dictCode": "el-icon-document",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 129,
          "dictName": "el-icon-document-add",
          "dictValue": null,
          "dictCode": "el-icon-document-add",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 130,
          "dictName": "el-icon-printer",
          "dictValue": null,
          "dictCode": "el-icon-printer",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 131,
          "dictName": "el-icon-paperclip",
          "dictValue": null,
          "dictCode": "el-icon-paperclip",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 132,
          "dictName": "el-icon-takeaway-box",
          "dictValue": null,
          "dictCode": "el-icon-takeaway-box",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 133,
          "dictName": "el-icon-search",
          "dictValue": null,
          "dictCode": "el-icon-search",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 134,
          "dictName": "el-icon-monitor",
          "dictValue": null,
          "dictCode": "el-icon-monitor",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 135,
          "dictName": "el-icon-attract",
          "dictValue": null,
          "dictCode": "el-icon-attract",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 136,
          "dictName": "el-icon-mobile",
          "dictValue": null,
          "dictCode": "el-icon-mobile",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 289,
          "dictName": "el-icon-folder-delete",
          "dictValue": null,
          "dictCode": "el-icon-folder-delete",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 290,
          "dictName": "el-icon-folder-checked",
          "dictValue": null,
          "dictCode": "el-icon-folder-checked",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 291,
          "dictName": "el-icon-tickets",
          "dictValue": null,
          "dictCode": "el-icon-tickets",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 292,
          "dictName": "el-icon-document-remove",
          "dictValue": null,
          "dictCode": "el-icon-document-remove",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 293,
          "dictName": "el-icon-document-delete",
          "dictValue": null,
          "dictCode": "el-icon-document-delete",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 294,
          "dictName": "el-icon-document-copy",
          "dictValue": null,
          "dictCode": "el-icon-document-copy",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 295,
          "dictName": "el-icon-document-checked",
          "dictValue": null,
          "dictCode": "el-icon-document-checked",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 296,
          "dictName": "el-icon-document",
          "dictValue": null,
          "dictCode": "el-icon-document",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 297,
          "dictName": "el-icon-document-add",
          "dictValue": null,
          "dictCode": "el-icon-document-add",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 298,
          "dictName": "el-icon-printer",
          "dictValue": null,
          "dictCode": "el-icon-printer",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 299,
          "dictName": "el-icon-paperclip",
          "dictValue": null,
          "dictCode": "el-icon-paperclip",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 300,
          "dictName": "el-icon-takeaway-box",
          "dictValue": null,
          "dictCode": "el-icon-takeaway-box",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 301,
          "dictName": "el-icon-search",
          "dictValue": null,
          "dictCode": "el-icon-search",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 302,
          "dictName": "el-icon-monitor",
          "dictValue": null,
          "dictCode": "el-icon-monitor",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 303,
          "dictName": "el-icon-attract",
          "dictValue": null,
          "dictCode": "el-icon-attract",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 304,
          "dictName": "el-icon-mobile",
          "dictValue": null,
          "dictCode": "el-icon-mobile",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 305,
          "dictName": "el-icon-scissors",
          "dictValue": null,
          "dictCode": "el-icon-scissors",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 306,
          "dictName": "el-icon-umbrella",
          "dictValue": null,
          "dictCode": "el-icon-umbrella",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 307,
          "dictName": "el-icon-headset",
          "dictValue": null,
          "dictCode": "el-icon-headset",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 308,
          "dictName": "el-icon-brush",
          "dictValue": null,
          "dictCode": "el-icon-brush",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 309,
          "dictName": "el-icon-mouse",
          "dictValue": null,
          "dictCode": "el-icon-mouse",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 310,
          "dictName": "el-icon-coordinate",
          "dictValue": null,
          "dictCode": "el-icon-coordinate",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 311,
          "dictName": "el-icon-magic-stick",
          "dictValue": null,
          "dictCode": "el-icon-magic-stick",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 312,
          "dictName": "el-icon-reading",
          "dictValue": null,
          "dictCode": "el-icon-reading",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 313,
          "dictName": "el-icon-data-line",
          "dictValue": null,
          "dictCode": "el-icon-data-line",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 314,
          "dictName": "el-icon-data-board",
          "dictValue": null,
          "dictCode": "el-icon-data-board",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 315,
          "dictName": "el-icon-pie-chart",
          "dictValue": null,
          "dictCode": "el-icon-pie-chart",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 316,
          "dictName": "el-icon-data-analysis",
          "dictValue": null,
          "dictCode": "el-icon-data-analysis",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 317,
          "dictName": "el-icon-collection-tag",
          "dictValue": null,
          "dictCode": "el-icon-collection-tag",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 318,
          "dictName": "el-icon-film",
          "dictValue": null,
          "dictCode": "el-icon-film",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 319,
          "dictName": "el-icon-suitcase",
          "dictValue": null,
          "dictCode": "el-icon-suitcase",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 320,
          "dictName": "el-icon-suitcase-1",
          "dictValue": null,
          "dictCode": "el-icon-suitcase-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 321,
          "dictName": "el-icon-receiving",
          "dictValue": null,
          "dictCode": "el-icon-receiving",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 322,
          "dictName": "el-icon-collection",
          "dictValue": null,
          "dictCode": "el-icon-collection",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 323,
          "dictName": "el-icon-files",
          "dictValue": null,
          "dictCode": "el-icon-files",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 324,
          "dictName": "el-icon-notebook-1",
          "dictValue": null,
          "dictCode": "el-icon-notebook-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 325,
          "dictName": "el-icon-notebook-2",
          "dictValue": null,
          "dictCode": "el-icon-notebook-2",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 326,
          "dictName": "el-icon-toilet-paper",
          "dictValue": null,
          "dictCode": "el-icon-toilet-paper",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 327,
          "dictName": "el-icon-office-building",
          "dictValue": null,
          "dictCode": "el-icon-office-building",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 328,
          "dictName": "el-icon-school",
          "dictValue": null,
          "dictCode": "el-icon-school",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 329,
          "dictName": "el-icon-table-lamp",
          "dictValue": null,
          "dictCode": "el-icon-table-lamp",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 330,
          "dictName": "el-icon-house",
          "dictValue": null,
          "dictCode": "el-icon-house",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 331,
          "dictName": "el-icon-no-smoking",
          "dictValue": null,
          "dictCode": "el-icon-no-smoking",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 332,
          "dictName": "el-icon-smoking",
          "dictValue": null,
          "dictCode": "el-icon-smoking",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 333,
          "dictName": "el-icon-shopping-cart-full",
          "dictValue": null,
          "dictCode": "el-icon-shopping-cart-full",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 334,
          "dictName": "el-icon-shopping-cart-1",
          "dictValue": null,
          "dictCode": "el-icon-shopping-cart-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 335,
          "dictName": "el-icon-shopping-cart-2",
          "dictValue": null,
          "dictCode": "el-icon-shopping-cart-2",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 336,
          "dictName": "el-icon-shopping-bag-1",
          "dictValue": null,
          "dictCode": "el-icon-shopping-bag-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 337,
          "dictName": "el-icon-shopping-bag-2",
          "dictValue": null,
          "dictCode": "el-icon-shopping-bag-2",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 338,
          "dictName": "el-icon-sold-out",
          "dictValue": null,
          "dictCode": "el-icon-sold-out",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 339,
          "dictName": "el-icon-sell",
          "dictValue": null,
          "dictCode": "el-icon-sell",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 340,
          "dictName": "el-icon-present",
          "dictValue": null,
          "dictCode": "el-icon-present",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 341,
          "dictName": "el-icon-box",
          "dictValue": null,
          "dictCode": "el-icon-box",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 342,
          "dictName": "el-icon-bank-card",
          "dictValue": null,
          "dictCode": "el-icon-bank-card",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 343,
          "dictName": "el-icon-money",
          "dictValue": null,
          "dictCode": "el-icon-money",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 344,
          "dictName": "el-icon-coin",
          "dictValue": null,
          "dictCode": "el-icon-coin",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 345,
          "dictName": "el-icon-wallet",
          "dictValue": null,
          "dictCode": "el-icon-wallet",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 346,
          "dictName": "el-icon-discount",
          "dictValue": null,
          "dictCode": "el-icon-discount",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 347,
          "dictName": "el-icon-price-tag",
          "dictValue": null,
          "dictCode": "el-icon-price-tag",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 348,
          "dictName": "el-icon-news",
          "dictValue": null,
          "dictCode": "el-icon-news",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 349,
          "dictName": "el-icon-guide",
          "dictValue": null,
          "dictCode": "el-icon-guide",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 350,
          "dictName": "el-icon-male",
          "dictValue": null,
          "dictCode": "el-icon-male",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 351,
          "dictName": "el-icon-female",
          "dictValue": null,
          "dictCode": "el-icon-female",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 352,
          "dictName": "el-icon-thumb",
          "dictValue": null,
          "dictCode": "el-icon-thumb",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 353,
          "dictName": "el-icon-cpu",
          "dictValue": null,
          "dictCode": "el-icon-cpu",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 354,
          "dictName": "el-icon-link",
          "dictValue": null,
          "dictCode": "el-icon-link",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 355,
          "dictName": "el-icon-connection",
          "dictValue": null,
          "dictCode": "el-icon-connection",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 356,
          "dictName": "el-icon-open",
          "dictValue": null,
          "dictCode": "el-icon-open",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 357,
          "dictName": "el-icon-turn-off",
          "dictValue": null,
          "dictCode": "el-icon-turn-off",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 358,
          "dictName": "el-icon-set-up",
          "dictValue": null,
          "dictCode": "el-icon-set-up",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 359,
          "dictName": "el-icon-chat-round",
          "dictValue": null,
          "dictCode": "el-icon-chat-round",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 360,
          "dictName": "el-icon-chat-line-round",
          "dictValue": null,
          "dictCode": "el-icon-chat-line-round",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 361,
          "dictName": "el-icon-chat-square",
          "dictValue": null,
          "dictCode": "el-icon-chat-square",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 362,
          "dictName": "el-icon-chat-dot-round",
          "dictValue": null,
          "dictCode": "el-icon-chat-dot-round",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 363,
          "dictName": "el-icon-chat-dot-square",
          "dictValue": null,
          "dictCode": "el-icon-chat-dot-square",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 364,
          "dictName": "el-icon-chat-line-square",
          "dictValue": null,
          "dictCode": "el-icon-chat-line-square",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 365,
          "dictName": "el-icon-message",
          "dictValue": null,
          "dictCode": "el-icon-message",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 366,
          "dictName": "el-icon-postcard",
          "dictValue": null,
          "dictCode": "el-icon-postcard",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 367,
          "dictName": "el-icon-position",
          "dictValue": null,
          "dictCode": "el-icon-position",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 368,
          "dictName": "el-icon-turn-off-microphone",
          "dictValue": null,
          "dictCode": "el-icon-turn-off-microphone",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 369,
          "dictName": "el-icon-microphone",
          "dictValue": null,
          "dictCode": "el-icon-microphone",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 370,
          "dictName": "el-icon-close-notification",
          "dictValue": null,
          "dictCode": "el-icon-close-notification",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 371,
          "dictName": "el-icon-bangzhu",
          "dictValue": null,
          "dictCode": "el-icon-bangzhu",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 372,
          "dictName": "el-icon-time",
          "dictValue": null,
          "dictCode": "el-icon-time",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 373,
          "dictName": "el-icon-odometer",
          "dictValue": null,
          "dictCode": "el-icon-odometer",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 374,
          "dictName": "el-icon-crop",
          "dictValue": null,
          "dictCode": "el-icon-crop",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 375,
          "dictName": "el-icon-aim",
          "dictValue": null,
          "dictCode": "el-icon-aim",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 376,
          "dictName": "el-icon-switch-button",
          "dictValue": null,
          "dictCode": "el-icon-switch-button",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 377,
          "dictName": "el-icon-full-screen",
          "dictValue": null,
          "dictCode": "el-icon-full-screen",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 378,
          "dictName": "el-icon-copy-document",
          "dictValue": null,
          "dictCode": "el-icon-copy-document",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 379,
          "dictName": "el-icon-mic",
          "dictValue": null,
          "dictCode": "el-icon-mic",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 380,
          "dictName": "el-icon-stopwatch",
          "dictValue": null,
          "dictCode": "el-icon-stopwatch",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 381,
          "dictName": "el-icon-medal-1",
          "dictValue": null,
          "dictCode": "el-icon-medal-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 382,
          "dictName": "el-icon-medal",
          "dictValue": null,
          "dictCode": "el-icon-medal",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 383,
          "dictName": "el-icon-trophy",
          "dictValue": null,
          "dictCode": "el-icon-trophy",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 384,
          "dictName": "el-icon-trophy-1",
          "dictValue": null,
          "dictCode": "el-icon-trophy-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 385,
          "dictName": "el-icon-first-aid-kit",
          "dictValue": null,
          "dictCode": "el-icon-first-aid-kit",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 386,
          "dictName": "el-icon-discover",
          "dictValue": null,
          "dictCode": "el-icon-discover",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 387,
          "dictName": "el-icon-place",
          "dictValue": null,
          "dictCode": "el-icon-place",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 388,
          "dictName": "el-icon-location",
          "dictValue": null,
          "dictCode": "el-icon-location",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 389,
          "dictName": "el-icon-location-outline",
          "dictValue": null,
          "dictCode": "el-icon-location-outline",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 390,
          "dictName": "el-icon-location-information",
          "dictValue": null,
          "dictCode": "el-icon-location-information",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 391,
          "dictName": "el-icon-add-location",
          "dictValue": null,
          "dictCode": "el-icon-add-location",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 392,
          "dictName": "el-icon-delete-location",
          "dictValue": null,
          "dictCode": "el-icon-delete-location",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 393,
          "dictName": "el-icon-map-location",
          "dictValue": null,
          "dictCode": "el-icon-map-location",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 394,
          "dictName": "el-icon-alarm-clock",
          "dictValue": null,
          "dictCode": "el-icon-alarm-clock",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 395,
          "dictName": "el-icon-timer",
          "dictValue": null,
          "dictCode": "el-icon-timer",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 396,
          "dictName": "el-icon-watch-1",
          "dictValue": null,
          "dictCode": "el-icon-watch-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 397,
          "dictName": "el-icon-watch",
          "dictValue": null,
          "dictCode": "el-icon-watch",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 398,
          "dictName": "el-icon-lock",
          "dictValue": null,
          "dictCode": "el-icon-lock",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 399,
          "dictName": "el-icon-unlock",
          "dictValue": null,
          "dictCode": "el-icon-unlock",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 400,
          "dictName": "el-icon-key",
          "dictValue": null,
          "dictCode": "el-icon-key",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 401,
          "dictName": "el-icon-service",
          "dictValue": null,
          "dictCode": "el-icon-service",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 402,
          "dictName": "el-icon-mobile-phone",
          "dictValue": null,
          "dictCode": "el-icon-mobile-phone",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 403,
          "dictName": "el-icon-bicycle",
          "dictValue": null,
          "dictCode": "el-icon-bicycle",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 404,
          "dictName": "el-icon-truck",
          "dictValue": null,
          "dictCode": "el-icon-truck",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 405,
          "dictName": "el-icon-ship",
          "dictValue": null,
          "dictCode": "el-icon-ship",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 406,
          "dictName": "el-icon-basketball",
          "dictValue": null,
          "dictCode": "el-icon-basketball",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 407,
          "dictName": "el-icon-football",
          "dictValue": null,
          "dictCode": "el-icon-football",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 408,
          "dictName": "el-icon-soccer",
          "dictValue": null,
          "dictCode": "el-icon-soccer",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 409,
          "dictName": "el-icon-baseball",
          "dictValue": null,
          "dictCode": "el-icon-baseball",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 410,
          "dictName": "el-icon-wind-power",
          "dictValue": null,
          "dictCode": "el-icon-wind-power",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 411,
          "dictName": "el-icon-light-rain",
          "dictValue": null,
          "dictCode": "el-icon-light-rain",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 412,
          "dictName": "el-icon-lightning",
          "dictValue": null,
          "dictCode": "el-icon-lightning",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 413,
          "dictName": "el-icon-heavy-rain",
          "dictValue": null,
          "dictCode": "el-icon-heavy-rain",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 414,
          "dictName": "el-icon-sunrise",
          "dictValue": null,
          "dictCode": "el-icon-sunrise",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 415,
          "dictName": "el-icon-sunrise-1",
          "dictValue": null,
          "dictCode": "el-icon-sunrise-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 416,
          "dictName": "el-icon-sunset",
          "dictValue": null,
          "dictCode": "el-icon-sunset",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 417,
          "dictName": "el-icon-sunny",
          "dictValue": null,
          "dictCode": "el-icon-sunny",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 418,
          "dictName": "el-icon-cloudy",
          "dictValue": null,
          "dictCode": "el-icon-cloudy",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 419,
          "dictName": "el-icon-partly-cloudy",
          "dictValue": null,
          "dictCode": "el-icon-partly-cloudy",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 420,
          "dictName": "el-icon-cloudy-and-sunny",
          "dictValue": null,
          "dictCode": "el-icon-cloudy-and-sunny",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 421,
          "dictName": "el-icon-moon",
          "dictValue": null,
          "dictCode": "el-icon-moon",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 422,
          "dictName": "el-icon-moon-night",
          "dictValue": null,
          "dictCode": "el-icon-moon-night",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 423,
          "dictName": "el-icon-dish",
          "dictValue": null,
          "dictCode": "el-icon-dish",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 424,
          "dictName": "el-icon-dish-1",
          "dictValue": null,
          "dictCode": "el-icon-dish-1",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 425,
          "dictName": "el-icon-food",
          "dictValue": null,
          "dictCode": "el-icon-food",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 426,
          "dictName": "el-icon-chicken",
          "dictValue": null,
          "dictCode": "el-icon-chicken",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 427,
          "dictName": "el-icon-fork-spoon",
          "dictValue": null,
          "dictCode": "el-icon-fork-spoon",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 428,
          "dictName": "el-icon-knife-fork",
          "dictValue": null,
          "dictCode": "el-icon-knife-fork",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 429,
          "dictName": "el-icon-burger",
          "dictValue": null,
          "dictCode": "el-icon-burger",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 430,
          "dictName": "el-icon-tableware",
          "dictValue": null,
          "dictCode": "el-icon-tableware",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 431,
          "dictName": "el-icon-sugar",
          "dictValue": null,
          "dictCode": "el-icon-sugar",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 432,
          "dictName": "el-icon-dessert",
          "dictValue": null,
          "dictCode": "el-icon-dessert",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 433,
          "dictName": "el-icon-ice-cream",
          "dictValue": null,
          "dictCode": "el-icon-ice-cream",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 434,
          "dictName": "el-icon-hot-water",
          "dictValue": null,
          "dictCode": "el-icon-hot-water",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 435,
          "dictName": "el-icon-water-cup",
          "dictValue": null,
          "dictCode": "el-icon-water-cup",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 436,
          "dictName": "el-icon-coffee-cup",
          "dictValue": null,
          "dictCode": "el-icon-coffee-cup",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 437,
          "dictName": "el-icon-cold-drink",
          "dictValue": null,
          "dictCode": "el-icon-cold-drink",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 438,
          "dictName": "el-icon-goblet",
          "dictValue": null,
          "dictCode": "el-icon-goblet",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 439,
          "dictName": "el-icon-goblet-full",
          "dictValue": null,
          "dictCode": "el-icon-goblet-full",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 440,
          "dictName": "el-icon-goblet-square",
          "dictValue": null,
          "dictCode": "el-icon-goblet-square",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 441,
          "dictName": "el-icon-goblet-square-full",
          "dictValue": null,
          "dictCode": "el-icon-goblet-square-full",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 442,
          "dictName": "el-icon-refrigerator",
          "dictValue": null,
          "dictCode": "el-icon-refrigerator",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 443,
          "dictName": "el-icon-grape",
          "dictValue": null,
          "dictCode": "el-icon-grape",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 444,
          "dictName": "el-icon-watermelon",
          "dictValue": null,
          "dictCode": "el-icon-watermelon",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 445,
          "dictName": "el-icon-cherry",
          "dictValue": null,
          "dictCode": "el-icon-cherry",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 446,
          "dictName": "el-icon-apple",
          "dictValue": null,
          "dictCode": "el-icon-apple",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 447,
          "dictName": "el-icon-pear",
          "dictValue": null,
          "dictCode": "el-icon-pear",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 448,
          "dictName": "el-icon-orange",
          "dictValue": null,
          "dictCode": "el-icon-orange",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 449,
          "dictName": "el-icon-coffee",
          "dictValue": null,
          "dictCode": "el-icon-coffee",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 450,
          "dictName": "el-icon-ice-tea",
          "dictValue": null,
          "dictCode": "el-icon-ice-tea",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 451,
          "dictName": "el-icon-ice-drink",
          "dictValue": null,
          "dictCode": "el-icon-ice-drink",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 452,
          "dictName": "el-icon-milk-tea",
          "dictValue": null,
          "dictCode": "el-icon-milk-tea",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 453,
          "dictName": "el-icon-potato-strips",
          "dictValue": null,
          "dictCode": "el-icon-potato-strips",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 454,
          "dictName": "el-icon-lollipop",
          "dictValue": null,
          "dictCode": "el-icon-lollipop",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 455,
          "dictName": "el-icon-ice-cream-square",
          "dictValue": null,
          "dictCode": "el-icon-ice-cream-square",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        },
        {
          "dictId": 456,
          "dictName": "el-icon-ice-cream-round",
          "dictValue": null,
          "dictCode": "el-icon-ice-cream-round",
          "parentId": 4,
          "gmtCreate": "2021-12-01 09:51:14",
          "hasChildren": null
        }
      ],
      userChooseIcon: '',
      chooseIcons: '',
      rule: {
        name: [{required: true, message: '菜单名称不能为空！', trigger: 'blur'}],
        path: [{required: true, message: '菜单路由不能为空！', trigger: 'blur'}],
        url: [{required: true, message: '菜单路径不能为空！', trigger: 'blur'}],
        component: [{required: true, message: '菜单组件不能为空！', trigger: 'blur'}],
        icon: [{required: true, message: '菜单图标不能为空！', trigger: 'blur'}],
      },
      menuForm: {
        id: null,
        name: '',
        path: '',
        url: '',
        delFlag: false,
        component: 'Home',
        icon: '',
        orderNum: 99,
        parentId: '',
        hide: true,
        enabled: true,
        remark: ''
      }
    }
  },
  methods: {
    toUpMenu(data) {
      this.drawer = true;
      Object.assign(this.menuForm,data);
    },
    saveMenu() {
      this.$refs["menuFormCheck"].validate(valid=>{
        if (valid) {
          if (this.menuForm.id === null) {
            this.postRequest("/system/menu/",this.menuForm).then(resp=>{
              if (resp) {
                this.initMenus();
                this.drawer = false;
              }
            })
          } else {
            this.putRequest("/system/menu/",this.menuForm).then(resp=>{
              if (resp) {
                this.initMenus();
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
    clearForm() {
      this.menuForm = {
        id: null,
        name: '',
        path: '',
        url: '',
        component: 'Home',
        icon: '',
        orderNum: 99,
        parentId: '',
        delFlag: false,
        hide: true,
        enabled: true,
        remark: ''
      }
    },
    //=======================   删除菜单信息  ===========================
    deleteMenu(data) {
      this.$confirm(`确认要删除名称为： <strong>${data.name}</strong> 的菜单信息吗？`, {
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(_ => {
        this.deleteRequest("/system/menu/?ids="+data.id).then(resp=>{
          if (resp) {
            this.initMenus();
          }
        })
      });
    },
    addMenu() {
      this.menuForm = this.menuForm = {
        id: null,
        name: '',
        path: '',
        url: '',
        component: 'Home',
        icon: '',
        orderNum: 99,
        parentId: '',
        delFlag: false,
        hide: true,
        enabled: true,
        remark: ''
      };
      this.drawer = true;
    },
    //  查询图标
    querySearch(queryString, cb) {
      var iconList = this.iconList;
      var results = queryString ? iconList.filter(this.createStateFilter(queryString)) : iconList;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.dictCode.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    setIcon(icon){
      console.log(icon)
      this.userChooseIcon=icon;//将i的样式设为选中的样式el-icon-xxx
      this.chooseIcons=""
    },
    initMenus() {
      this.getRequest("/system/menu/").then(resp=>{
        this.loading = true;
        if (resp) {
         this.menus = resp;
          this.loading = false;
        }
      })
    }
  },
  mounted() {
    this.initMenus();
  },

}
</script>

<style scoped>
.top-container {
  width: 100%;
}

.search-container {
  width: 100%;
  display: flex;
  justify-content: left;
}

.save-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.el-button--text {
  color: #70b2f8;
  font-size: 12px;
}
</style>
