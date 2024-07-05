import axios from "axios";
import { isDev } from './constants';

export const api = axios.create({
  baseURL: isDev ? 'https://trodat-back.onrender.com/api' : 'https://trodat-back.onrender.com/api',
  responseType: 'json'
});