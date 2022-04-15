<template>
      <div class="app-box">
        <div class="menu-nav">
          <el-dropdown>
            <el-button class="menu-button"  plain>
            <i class="el-icon-s-operation"></i>
            </el-button>
            <el-dropdown-menu class="menu-item" slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="home">
          <HelloWorld msg="Welcome to Your Vue.js App"/>
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
    .el-dropdown + .el-dropdown {
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
