import firebase from 'firebase'

export default {
  createUser (context, {email, name, username, avatar = null}) {
    return new Promise((resolve, reject) => {
      const timestamp = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {avatar, email, name, username, usernameLower, RegisteredAt: timestamp}

      const userId = firebase.database().ref('users').push().key
      firebase.database().ref('users').child(userId).set(user)
      .then(() => {
        context.commit('setItem', {item: user, id: userId, resource: 'users'})
        resolve(context.state.users[userId])
      })
    })
  },

  createPost (context, post) {
    const postId = firebase.database().ref('posts').push().key
    const timestamp = Math.floor(Date.now() / 1000)
    post.userId = context.state.authId
    post.publishedAt = timestamp

    const updates = {}

    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId

    firebase.database().ref().update(updates)
    .then(() => {
      context.commit('setItem', {resource: 'posts', item: post, id: postId})
      context.commit('addPostToThread', {parentId: post.threadId, childId: postId})
      context.commit('addPostToUser', {childId: postId, parentId: post.userId})
      context.commit('addContributorToThread', {parentId: post.threadId, childId: post.userId})
      return Promise.resolve(context.state.posts[postId])
    })
  },

  updatePost (context, {id, newText}) {
    return new Promise((resolve, reject) => {
      const post = context.state.posts[id]
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: context.state.authId
      }

      const updates = {}
      updates.text = newText
      updates.edited = edited
      firebase.database().ref('posts').child(id).update(updates)
      .then(() => {
        context.commit('setPost', {post: {...post, text: newText, edited}, postId: id})
        resolve(post)
      })
    })
  },

  updateUser (context, userData) {
    context.commit('setUser', {userId: userData['.key'], userData})
  },

  createThread (context, {title, text, forumId}) {
    return new Promise((resolve, reject) => {
      const threadId = firebase.database().ref('threads').push().key
      const timestamp = Math.floor(Date.now() / 1000)
      const userId = context.state.authId

      const postId = firebase.database().ref('posts').push().key

      const thread = {
        firstPostId: postId,
        title,
        forumId,
        userId,
        publishedAt: timestamp,
        posts: {}
      }

      thread.posts[postId] = postId

      const post = {
        text,
        publishedAt: timestamp,
        userId,
        threadId
      }

      const updates = {}
      // thread
      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId

      updates[`posts/${postId}`] = post
      updates[`users/${post.userId}/posts/${postId}`] = postId

      firebase.database().ref().update(updates)
      .then(() => {
        // update thread
        context.commit('setItem', {resource: 'threads', item: thread, id: threadId})
        context.commit('addThreadToForum', {childId: threadId, parentId: forumId})
        context.commit('addThreadToUser', {childId: threadId, parentId: userId})

        // update post
        context.commit('setItem', {resource: 'posts', item: post, id: postId})
        context.commit('addPostToThread', {parentId: post.threadId, childId: postId})
        context.commit('addPostToUser', {childId: postId, parentId: post.userId})

        resolve(context.state.threads[threadId])
      })
    })
  },

  updateThread (context, {id, title, text}) {
    return new Promise((resolve, reject) => {
      const thread = context.state.threads[id]
      // const post = context.state.posts[thread.firstPostId]

      const post = context.state.posts[thread.firstPostId]

      const newThread = {...thread, title}
      // const newPost = {...post, text}

      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: context.state.authId
      }

      const updates = {}
      updates[`posts/${thread.firstPostId}/text`] = text
      updates[`posts/${thread.firstPostId}/edited`] = edited
      updates[`threads/${id}/title`] = title

      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setThread', {thread: newThread, threadId: id})
        context.commit('setPost', {post: {...post, text, edited}, postId: thread.firstPostId})
        resolve(post)
      })
    })
  },

  fetchCategory (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'categories', id})
  },

  fetchCategories (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'categories', ids})
  },

  fetchThread (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'threads', id})
  },

  fetchThreads (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'threads', ids})
  },

  fetchPost (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'posts', id})
  },

  fetchPosts (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'posts', ids})
  },

  fetchForum (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'forums', id})
  },

  fetchForums (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'forums', ids})
  },

  fetchUser (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'users', id})
  },

  fetchUsers (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'users', ids})
  },

  fetchItem (context, {id, resource}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        context.commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(context.state[resource][id])
      })
    })
  },

  fetchItems (context, {ids, resource}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => context.dispatch('fetchItem', {id, resource})))
  },

  fetchAllCategories (context) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          context.commit('setItem', {resource: 'categories', id: categoryId, item: category})
        })
        resolve(Object.values(context.state.categories))
      })
    })
  }
}
