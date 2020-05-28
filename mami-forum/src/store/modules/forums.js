import {makeAddChildToParentMutation} from '@/store/assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {}
  },
  actions: {
    // if accessing global actions set root to true (no namespace needed)
    fetchForum (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'forums', id}, {root: true})
    },

    fetchForums (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'forums', ids}, {root: true})
    }
  },
  mutations: {
    addThreadToForum: makeAddChildToParentMutation({parent: 'forums', child: 'threads'})
  }
}
