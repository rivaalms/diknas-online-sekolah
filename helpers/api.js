import axios from 'axios'

const apiUrl = process.env.DIKNAS_ONLINE_API_URL

function getSchool(id) {
   const data = axios.get(`${apiUrl}/school/${id}`).then((resp) => { return resp.data })
   return data
}

export default {apiUrl, getSchool}