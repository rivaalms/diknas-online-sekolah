import axios from 'axios'

const API_URL = process.env.DIKNAS_ONLINE_API_URL

function getSchool(id) {
   const data = axios.get(`${API_URL}/school/get/${id}`).then((resp) => { return resp.data })
   return data
}

function getCategories() {
   const data = axios.get(`${API_URL}/getCategories`).then((resp) => { return resp.data })
   return data
}

function getCategory(slug) {
   const data = axios.get(`${API_URL}/getCategory`).then((resp) => { return resp.data })
   return data
}

function getDataTypes(slug) {
   const data = axios.get(`${API_URL}/getDataTypes/${slug}`).then((resp) => { return resp.data })
   return data
}

function getUser() {
   const data = axios.get(`${API_URL}/school/getSelf`).then((resp) => { return resp.data })
   return data
}

function getData(id) {
   const data = axios.get(`${API_URL}/school/getData/${id}`).then((resp) => { return resp.data })
   return data
}

export default { API_URL, getSchool, getCategories, getUser, getDataTypes , getCategory, getData }