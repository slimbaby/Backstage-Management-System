<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList">
        <el-table-column type="expand" label="展开">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              style="margin-buttom: 20px; padding: 20px"
            >
              <el-col :span="5">
                <el-tag type="primary" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <div
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  style="
                    margin: 10px 0;
                    padding: 20px;
                    background-color: #e5e5eb;
                  "
                >
                  <el-row>
                    <el-col :span="5">
                      <el-tag type="warning" closable>{{
                        item2.authName
                      }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="19">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="danger"
                        closable
                        @close="removeRightById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="展开" prop="roleName"></el-table-column>
        <el-table-column label="展开" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-tooltip content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showRightFn(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="30%">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :default-checked-keys="selectedKeys"
        node-key="id"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="rightDialogVisible = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      rightsList: [],
      defaultProps: {
        label: 'authName'
      },
      selectedKeys: [],
      rightDialogVisible: false
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('查询失败')
      console.log(res)
      this.rolesList = res.data
    },
    removeRightById (role, id) {
      this.$confirm('永久删除，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${id}`
          )
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          console.log(res)
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showRightFn (role) {
      this.rightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.message.error('获取失败')
      console.log(res)
      this.rightsList = res.data
      const arr = []
      // if (role.children.length > 0) {
      //   role.children.forEach(item1 => {
      //     if (item1.children.length > 0) {
      //       item1.children.forEach(item2 => {
      //         if (item2.children.length > 0) {
      //           item2.children.forEach(item3 => {
      //             arr.push(item3.id)
      //           })
      //         }
      //       })
      //     }
      //   })
      // }

      function fn (obj) {
        if (obj.children) {
          obj.children.forEach((item) => {
            fn(item)
          })
        } else {
          arr.push(obj.id)
        }
      }
      fn(role)
      this.selectedKeys = arr
    }
  },
  computed: {}
}
</script>

<style scoped>
</style>
