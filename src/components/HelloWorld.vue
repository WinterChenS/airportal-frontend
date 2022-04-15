<template>
  <div class="hello">
  <img class="logo" alt="Vue logo" src="../assets/logo.png">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-change="handleChange">
      <!--<div @mouseenter="enter()" @mouseleave="leave()">
        <el-button class="upload-button" size="small" type="primary">发送</el-button>
      </div>-->
      <el-popover
        placement="top-start"
        title="标题"
        width="200"
        offset=-180
        visible-arrow=false
        trigger="hover"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <el-button class="upload-button" size="small" type="primary" slot="reference">发送</el-button>
      </el-popover>
    </el-upload>
    <el-row>
      <el-button class="receive-button" plain>接收</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    // data() {
    //   return {
    //     fileList: [{
    //       name: 'food.jpeg',
    //       url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    //     }, {
    //       name: 'food2.jpeg',
    //       url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    //     }]
    //   };
    // },
    methods: {
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      enter() {
        
      },
      leave() {
        
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello {
  top: 100px;
  .upload-button {
    width: 224px;
    height: 49px;
    border-radius: 10px;
    font-size: 15px;
  }
  .receive-button {
    margin-top: 15px;
    width: 224px;
    height: 49px;
    border-radius: 10px;
    font-size: 15px;
  }
  .logo {
    margin-bottom: 100px;
  }
  
}



</style>
