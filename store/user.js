export const state = () => ({
   user: []
})

export const mutations = {
   SET_USER_DATA(state, payload) {
      state.user = payload
   }
}

export const actions = {
   getUserData({ commit }) {
      return new Promise((resolve, reject) => {
         this.$axios.get('/school/getSelf').then(response => {
            commit('SET_USER_DATA', response.data.data)
            resolve()
         })
      })
   }
}