<template>
  <div class="app-box">
    <div class="menu-nav">
      <el-dropdown>
        <el-button class="menu-button" plain>
          <i class="el-icon-s-operation"></i>
        </el-button>
        <el-dropdown-menu class="menu-item" trigger="click">
          <el-dropdown-item @click.native="checkLogin">{{ userName }}</el-dropdown-item>
          <el-dropdown-item @click.native="myList" v-show="userName !== '登录'">我的文件</el-dropdown-item>
          <el-dropdown-item @click.native="logout">{{ logoutName }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="home">
      <HelloWorld msg="Welcome to Your Vue.js App" />
      <el-dialog title="取件" :visible.sync="myListVisible" width="30%" center>
        <div v-html="fileList"></div>
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
          if (res.data.length > 0) {
            var list = '';
            for (var item of res.data) {
              list += '<div class="shareList" ><p class="shareItem">' + item.takeCode + '</p> <i @click.native="remove("' + item.takeCode + '")" class="el-icon-close" ></i> </div>';
            }
            this.fileList = list;
          } else {
            this.fileList = '<p>暂无数据</p>';
          }
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
    },
    remove (takeCode) {
      alert("删除" + takeCode);
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

  .shareList {
    height: 30px;
    background: #dee7f7;
    align-content: center;

    .shareItem {
      font-size: 17px;
      margin-left: 5px;
      margin-top: 2px;
      display: initial;
    }

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
