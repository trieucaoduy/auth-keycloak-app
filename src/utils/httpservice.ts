import axios, { Axios, InternalAxiosRequestConfig } from "axios";
import keycloakService from "./auth";

const _axios = axios.create();


const cb = (config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${keycloakService.getAccessToken()}`;
  return config;
}

const configureAxiosKeycloak = (): void => {
  _axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig  => {
      if (keycloakService.isLoggedIn()) {
        keycloakService.updateToken(cb(config));
      }

      return config;
    }
  );
}

const getAxiosClient = (): Axios => _axios;

const httpservice = {
  configureAxiosKeycloak,
  getAxiosClient
}

export default httpservice;