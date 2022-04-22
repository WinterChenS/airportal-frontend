<template>
  <div class="app-box">
    <div class="menu-nav">
      <el-dropdown>
        <el-button class="menu-button" plain>
          <i class="el-icon-s-operation"></i>
        </el-button>
        <el-dropdown-menu class="menu-item" trigger="click">
          <el-dropdown-item @click.native="checkLogin">{{ userName }}</el-dropdown-item>
          <el-dropdown-item @click.native="myList">我的文件</el-dropdown-item>
          <el-dropdown-item @click.native="logout">{{ logoutName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="home">
      <HelloWorld msg="Welcome to Your Vue.js App" />
      <el-dialog title="取件" :visible.sync="myListVisible" center>
        <div>{{ fileList }}}</div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="myList">刷 新</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data () {
    return {
      userName: sessionStorage.getItem("user") === null ? '登录' : JSON.parse(sessionStorage.getItem("user")).userName,
      myListVisible: false,
      fileList: '',
      logoutName: '',
    }
  },
  created () {
    if (sessionStorage.getItem("user") !== null) {
      this.logoutName = '退出登录';
    }
  },
  methods: {
    checkLogin () {
      this.$api.check().then(res => {

      })
    },
    myList () {
      this.myListVisible = true;
      this.$api.listCurrent().then(res => {
        if (res.code === 1) {
          this.fileList = '<el-tag  v-for="tag in tags" :key="tag.name" closable :type="tag.type"> ' + res.data.takeCode + ' </el-tag>'
        }
      });
    },
    logout () {
      this.$api.logout().then(res => {
        sessionStorage.clear()
        sessionStorage.clear()
        this.userName = '请登录';
        this.logoutName = '';
        this.$message({
          type: "success",
          message: "退出成功!"
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);

  .menu-nav {
    height: 100px;
    text-align: right;
  }

  .home {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown+.el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .menu-button {
    border: 0px solid #DCDFE6;
  }

  .el-icon-s-operation {
    font-size: 30px;
  }

}

.menu-item {
  transform-origin: center top;
  display: block;
  z-index: 2017;
  width: 200px;
  border-radius: 2px;
  top: -10px;

  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
<style lang="css">
.menu-item {
  transform-origin: center top;
  z-index: 2017;
  width: 200px;
  border-radius: 2px;
  top: -10px !important;
}
</style>
