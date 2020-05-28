import firebase from 'firebase'

export default {
  state: {
    items: {}
  },
  actions: {
    fetchCategory (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'categories', id})
    },

    fetchCategories (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'categories', ids})
    },

    fetchAllCategories (context) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            context.commit('setItem', {resource: 'categories', id: categoryId, item: category})
          })
          resolve(Object.values(context.state.items))
        })
      })
    }
  }
}
