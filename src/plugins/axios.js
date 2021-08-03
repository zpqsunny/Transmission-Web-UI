import axios from 'axios'
import router from '../router'

// axios.defaults.baseURL = 'http://127.0.0.1:9091/transmission/rpc'

axios.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['x-transmission-session-id'] = localStorage.getItem('x-transmission-session-id')
  config.baseURL = localStorage.getItem('url')
  let auth = localStorage.getItem('auth')
  if (auth !== null && auth === 'true') {
    config.auth = {
      username : localStorage.getItem('username'),
      password : localStorage.getItem('password')
    }
  }
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error);
})

axios.interceptors.response.use(response => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, error => {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.clear()
      router.push({path: '/login'})
    }
    if (error.response.status === 409) {
      localStorage.setItem('x-transmission-session-id', error.response.headers['x-transmission-session-id'])
    }
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});
export default axios
