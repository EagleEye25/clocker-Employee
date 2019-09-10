import axios from 'axios';

const serverAddy = window.localStorage.getItem('serverAddy');

const params = {
  baseURL: serverAddy
};
const instance = axios.create(params);
export default instance;
