
import {countObjectProperties} from '@/utils'

export default {
  authUser (state) {
    return state.users[state.authId]
  },

  userPostsCount (state) {
    return id => countObjectProperties(state.users[id].posts)
  },

  userThreadsCount (state) {
    return id => countObjectProperties(state.users[id].threads)
  },

  threadRepliesCount (state) {
    return id => countObjectProperties(state.threads[id].posts) - 1
  }
}
