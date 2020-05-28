import firebase from 'firebase'

export default {
  namespaced: true,

  state: {
    items: {}
  },
  actions: {
    // if accessing global actions set root to true (no namespace needed)
    fetchCategory (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'categories', id}, {root: true})
    },

    fetchCategories (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'categories', ids}, {root: true})
    },

    fetchAllCategories (context) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            // if accessing global mutations set root to true (no namespace needed)
            context.commit('setItem', {resource: 'categories', id: categoryId, item: category}, {root: true})
          })
          resolve(Object.values(context.state.items))
        })
      })
    }
  }
}
