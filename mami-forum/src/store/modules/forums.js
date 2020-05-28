import {makeAddChildToParentMutation} from '@/store/assetHelpers'

export default {
  state: {
    items: {}
  },
  actions: {
    fetchForum (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'forums', id})
    },

    fetchForums (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'forums', ids})
    }
  },
  mutations: {
    addThreadToForum: makeAddChildToParentMutation({parent: 'forums', child: 'threads'})
  }
}
