import firebase from 'firebase'

export default {
  fetchItem (context, {id, resource}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        context.commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(context.state[resource].items[id])
      })
    })
  },

  fetchItems (context, {ids, resource}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => context.dispatch('fetchItem', {id, resource})))
  }
}
