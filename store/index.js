export const state = () => ({
   isAuth: false,
   api_token: null,
   alert: {
      type: null,
      color: null,
      icon: null,
      message: null,
   },
   alertTrigger: false,

   data: {},
   dialogNewTrigger: false,
   dialogEditTrigger: false,
   dialogDeleteTrigger: false,

   dialog: null,

   revision: null,
   formUtils: null,

   snackbarTrigger: false,
   snackbar: null,

   breadcrumb: [],

   tableHeader: [
      {
         text: 'ID',
         value: 'id'
      },
      {
         text: 'Tipe data',
         value: 'data_type.name'
      },
      {
         text: 'Kategori',
         sortable: false,
         value: 'data_type.data_category.name'
      },
      {
         text: 'Tahun ajaran',
         value: 'year'
      },
      {
         text: 'Status',
         sortable: false,
         value: 'data_status.name'
      },
      {
         text: 'Terakhir diperbarui',
         value: 'date'
      },
      {
         text: 'Aksi',
         sortable: false,
         value: 'actions'
      }
   ],
})

export const mutations = {
   SET_IS_AUTH(state, payload) {
      state.isAuth = payload
   },
   SET_API_TOKEN(state, payload) {
      state.api_token = payload
   },

   SET_ALERT(state, payload) {
      state.alert = payload
   },

   SHOW_ALERT(state) {
      state.alertTrigger = true
   },

   CLEAR_ALERT(state) {
      state.alert = {
         type: null,
         color: null,
         icon: null,
         message: null,
      }
      state.alertTrigger = false
   },

   SET_DATA(state, payload) {
      state.data = payload
   },

   CLEAR_DATA(state) {
      state.data = {}
   },

   SET_REVISION(state, payload) {
      state.revision = payload
   },

   CLEAR_REVISION(state) {
      state.revision = null
   },

   SET_FORM_UTILS(state, payload) {
      state.formUtils = payload
   },

   CHANGE_FORM_UTILS(state, item, payload) {
      state.formUtils[item] = payload
   },

   CLEAR_FORM_UTILS(state) {
      state.formUtils = null
   },

   SET_DIALOG(state, payload) {
      state.dialog = payload
   },

   SHOW_EDIT_DIALOG(state) {
      state.dialogEditTrigger = true
   },

   SHOW_NEW_DIALOG(state) {
      state.dialogNewTrigger = true
   },

   SHOW_DELETE_DIALOG(state) {
      state.dialogDeleteTrigger = true
   },

   CLEAR_DIALOG(state) {
      state.dialog = null
      state.dialogEditTrigger = false
      state.dialogNewTrigger = false
      state.dialogDeleteTrigger = false
   },

   SET_SNACKBAR(state, payload) {
      state.snackbar = payload
   },

   SHOW_SNACKBAR(state) {
      state.snackbarTrigger = true
   },

   CLEAR_SNACKBAR(state) {
      state.snackbarTrigger = false
      state.snackbar = null
   },

   SET_BREADCRUMB(state, payload) {
      state.breadcrumb = payload
   },

   CLEAR_BREADCRUMB(state) {
      state.breadcrumb = []
   }
}

export const actions = {
   nuxtServerInit({commit}, context) {
      commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
      if(context.app.$auth.$state.loggedIn) {
         commit('SET_API_TOKEN', context.app.$auth.$state.user.api_token)
      }
   },

   setAlert({commit}, payload) {
      commit('SET_ALERT', payload)
   },
   
   showAlert({commit}) {
      commit('SHOW_ALERT')
   },

   clearAlert({commit}) {
      commit('CLEAR_ALERT')
   },

   setData({commit}, payload) {
      commit('SET_DATA', payload)
   },

   clearData({commit}) {
      commit('CLEAR_DATA')
   },

   setRevision({commit}, payload) {
      commit('SET_REVISION', payload)
   },

   setFormUtils({commit}, payload) {
      commit('SET_FORM_UTILS', payload)
   },

   changeFormUtils({commit}, item, payload) {
      commit('CHANGE_FORM_UTILS', item, payload)
   },
   
   clearFormUtils({commit}) {
      commit('CLEAR_FORM_UTILS')
   },

   setDialog({commit}, payload) {
      commit('SET_DIALOG', payload)
   },

   showEditDialog({commit}) {
      commit('SHOW_EDIT_DIALOG')
   },

   showNewDialog({commit}) {
      commit('SHOW_NEW_DIALOG')
   },

   showDeleteDialog({commit}) {
      commit('SHOW_DELETE_DIALOG')
   },

   closeDialog({commit}) {
      commit('CLEAR_DIALOG')
      commit('CLEAR_DATA')
      commit('CLEAR_FORM_UTILS')
      commit('CLEAR_REVISION')
   },

   setSnackbar({commit}, payload) {
      commit('SET_SNACKBAR', payload)
   },

   showSnackbar({commit}) {
      commit('SHOW_SNACKBAR')
   },

   clearSnackbar({commit}) {
      commit('CLEAR_SNACKBAR')
   },

   setBreadcrumb({commit}, payload) {
      commit('SET_BREADCRUMB', payload)
   },

   onMountedPage({dispatch}) {
      dispatch('clearAlert')
      dispatch('closeDialog')
      dispatch('clearData')
   },
}