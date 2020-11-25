<template>
  <div>
    <h1>Uplaod上传图片</h1>
    <label
      for="upload"
      class="btn"
      :class="{upLoading: isUploading}">选择图片上传</label>
    <!-- input:file accept限制上传的文件类型 -->
    <input
      type="file"
      name="upload"
      id="upload"
      multiple
      accept="image/*"
      ref="file"
      @change="onChange"
      :disabled="isUploading">
    <p class="tip">提示：一次可选择多张图片，最多不超过9张（单张图片大小 &lt; 1M）</p>
    <ul class="img-container">
      <li
        v-for="(item, index) in imgList"
        :key="index"
        :style="{background:`url(${item}) no-repeat center/contain`}"></li>
    </ul>
  </div>
</template>

<script>
import OSS from 'ali-oss'
export default {
  data () {
    return {
      // accessKeyId 和 a ccessKeySecret
      client: new OSS({
        region: 'oss-cn-shanghai',
        bucket: 'ecma-img'
      }),
      imgList: [], // 上传完成的图片
      isUploading: false
    }
  },
  methods: {
    onChange () {
      // input:file 上传的东西都放在'files'字段
      // 可选链
      const upFiles = this.$refs?.file?.files
      console.log(upFiles)
      // 校验
      if (upFiles.length > 9) {
        alert('最多可以一次选择9张图片')
        return false
      }
      const files = []
      for (const file of upFiles) {
        const size = file.size / 1024 / 1024 // 转M
        const type = file.type.startsWith('image/')
        if (size > 1) {
          alert('请选择1M以内的图片')
          return false
        }
        if (!type) {
          alert('请选择图片格式文件')
          return false
        }
        files.push(file)
      }
      // 上传到OSS
      this.uploadFilesByOSS2(files)
    },
    // 上传到阿里云OSS
    uploadFilesByOSS (files) {
      this.isUploading = true
      // OSS是一张张传的
      const uploadRequest = []
      for (const file of files) {
        uploadRequest.push(
          new Promise((resolve, reject) => {
            this.client.put(`${Math.random()}-${file.name}`, file)
              .then(res => {
                resolve(res.url)
              })
              .catch(err => {
                console.log(err)
                reject(err)
              })
          })
        )
      }
      Promise.allSettled(uploadRequest)
        .then(res => {
          console.log(res)
          const imgs = []
          for (const item of res) {
            if (item.status === 'fulfilled') {
              imgs.push(item.value)
            }
          }
          this.imgList = imgs
          this.isUploading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    async uploadFilesByOSS2 (files) {
      // 优化
      this.isUploading = true
      const imgs = []
      for (const file of files) {
        const result = await this.client.put(`${Math.random()}-${file.name}`, file)
        imgs.push(result.url)
      }
      this.imgList = imgs
      this.isUploading = false
    }
  }
}
</script>

<style scoped>
.btn {
  display: block;
  margin: 0 auto;
  width: 150px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background-color: #42b983;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
.btn + input {
  display: none;
}
.tip {
  color: #ccc;
}
ul,li {
  padding: 0;
  list-style: none;
}

.img-container > li{
    list-style: none;
    width: 150px;
    height: 100px;
    float: left;
    margin: 0 30px 30px 0;
    border: 1px solid #ccc;
}

.upLoading{
    background-color: #ccc;
}
</style>
