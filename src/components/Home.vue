<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header style="height: 100px">
      <div class="left">
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="right">
        <el-button type="info" @click="logOut">退出</el-button>
      </div>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏菜单 -->
      <el-aside :width="isCollapse === true ? '64px' : '200px'">
        <!-- 折叠样式 -->
        <div class="toggle" @click="isCollapse = !isCollapse">|||</div>
        <!-- 侧边栏菜单模板 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>&nbsp;&nbsp;
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="toggleActivePath('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
  },
  data () {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleActivePath (path) {
      this.activePath = path
      window.sessionStorage.setItem('activePath', path)
    }
  },
  computed: {}
}
</script>

<style lang= "less" scoped>
.home_container {
  height: 100vh;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    .left {
      img {
        margin-right: 30px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        color: #ddd;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.toggle {
  letter-spacing: 4px;
  text-align: center;
  color: #fff;
  font-size: 15px;
  background-color: #4a5064;
  padding: 4px;
  cursor: pointer;
}
</style>
