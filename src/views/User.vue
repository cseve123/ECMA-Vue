<template>
  <div>
    <h1>用户信息</h1>
    <button @click="asc">升序</button>
    <button @click="dasc">降序</button>
    <button @click="reset">重置</button>
    <ul>
      <li v-for="(item, index) of userList" :key="index">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
// es6 import
import axios from 'axios'
// es6 export
export default {
  data () {
    return {
      userList: []
    }
  },
  // created () {
  //   axios.get('http://jsonplaceholder.typicode.com/users').then(res => {
  //     console.log(res)
  //     this.userList = res.data
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }
  // ES8 async await
  async created () {
    // ES6 rest
    const { data } = await axios('http://jsonplaceholder.typicode.com/users')
    // console.log(res)
    this.proxy = new Proxy({}, {
      get (target, key) {
        if (key === 'asc') {
          // sort 会改变原有的data
          return [...data].sort((a, b) => a.name > b.name ? 1 : -1)
        } else if (key === 'dasc') {
          return [...data].sort((a, b) => b.name > a.name ? 1 : -1)
        } else {
          return data
        }
      },
      set () {
        return false
      }
    })
    this.userList = this.proxy.default
  },
  methods: {
    asc () {
      this.userList = this.proxy.asc
    },
    dasc () {
      this.userList = this.proxy.dasc
    },
    reset () {
      this.userList = this.proxy.default
    }
  }
}
</script>

<style scoped>
  ul {
    padding: 0;
  }
  li {
    list-style: none;
  }
</style>
