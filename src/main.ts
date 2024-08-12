import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import keycloakService from './utils/auth';
import httpservice from './utils/httpservice';

const initApp = () => createApp(App).mount('#app');

keycloakService.callLogin(initApp);
httpservice.configureAxiosKeycloak();
