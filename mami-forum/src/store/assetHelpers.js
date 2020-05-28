import Vue from 'vue'

export const makeAddChildToParentMutation = function ({child, parent}) {
  return (state, {childId, parentId}) => {
    const resource = state.items[parentId] // [parent] changed to items because it is the same
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }
}
