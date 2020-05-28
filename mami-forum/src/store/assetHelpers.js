import Vue from 'vue'

export const makeAddChildToParentMutation = function ({child, parent}) {
  return (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }
}
