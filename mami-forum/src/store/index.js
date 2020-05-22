import Vue from 'vue'
import vuex from 'vuex'
import sourceData from '@/data.json'

Vue.use(vuex)

export default new vuex.Store({
  state: sourceData
})
