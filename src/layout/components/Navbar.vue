<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="app-breadcrumb">
      {{ $t('navbar.title') }}
      <span class="breadBtn">{{ $t('navbar.version') }}</span>
    </div>
    <!-- 导航右边 -->
    <div class="right-menu">
      <!-- 全屏组件 -->
      <screen-full class="right-menu-item" />
      <!-- 中英文切换 -->
      <Language class="right-menu-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 用户头像 -->
          <img v-imgerror="defaultImage" :src="staffPhoto" class="user-avatar">
          <!-- 用户名 -->
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <!--
          站内跳转用router-link
          站外跳转用a
         -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> {{ $t('navbar.dashboard') }}  </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/ALuckyBoy/hrsass">
            <el-dropdown-item>{{ $t('navbar.github') }} </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="handleLogout">
            <span v-color="color" style="display: block">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
// 在webpack环境下, 必须引入然后再使用图片
import errorImg from '@/assets/common/bigUserHeader.png'
// const errorImg = require('@/assets/common/my.jpg')
export default {
  components: {
    Hamburger
  },
  data() {
    return {
      // 1. 默认图片(当img标签的src属性加载失败的时候使用)
      // defaultImage: 'https://img0.baidu.com/it/u=974773250,3873960466&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=497',
      // 本地图片需要导入才会显示
      defaultImage: errorImg,
      color: 'pink'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'staffPhoto'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    handleLogout() {
      this.$confirm('温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用仓库的方法
        this.$store.dispatch('user/loginOut')
        // 跳转到登录页
        this.$router.push('/login')
        this.$message.success('退出登录成功~')
      }).catch(() => {
        this.$message.info('您已取消退出登录~')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: middle;
      margin-right: 10px;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          cursor: pointer;
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
