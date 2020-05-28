import Vue from 'vue'

export default{
  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource].items, id, item) // now accessing state[resource].items (local state of each modules)
  }
}
