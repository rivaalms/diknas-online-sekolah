export default function ({ $axios, store }) {
   $axios.setHeader('Content-Type', 'application/json')
   $axios.setHeader('User-Type', 1)
   $axios.setToken(store.state.api_token, 'Bearer')
}