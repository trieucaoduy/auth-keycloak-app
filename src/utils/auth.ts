import Keycloak from "keycloak-js";
import { KEYCLOAK } from "./constants";

interface CallbackOneParam<T1 = void, T2 = void> {
  (param1: T1): T2;
}

const keycloakInstance = new Keycloak({
  url: KEYCLOAK.URL,
  realm: KEYCLOAK.REALM,
  clientId: KEYCLOAK.CLIENT_ID
});

const INSTANCE = {
  redirectUri: KEYCLOAK.REDIRECT_URI,
  enableLogging: true,
  checkLoginIframe: false
}

const login = (onAuthenticatedCallback: CallbackOneParam) => {
  keycloakInstance
    .init({
      ...INSTANCE,
      onLoad: "login-required"
    })
    .then((authenticated) => {
      authenticated ? onAuthenticatedCallback() : alert("Not authenticated");
    })
    .catch((e) => {
      console.dir(e);
      console.log("keycloak init exception: ", e)
    })
}

const username = (): string | undefined => keycloakInstance?.tokenParsed?.preferred_username;

const instanceToken = () => keycloakInstance?.tokenParsed;

const token = (): string | undefined => keycloakInstance?.token;

const logout = () => keycloakInstance.logout();

const userRoles = (): string[] | undefined => keycloakInstance?.resourceAccess?.[KEYCLOAK.CLIENT_ID]?.roles ?? undefined;

const updateToken = (successCallback: any) => keycloakInstance.updateToken(5).then(successCallback).catch(doLogin);

const doLogin = keycloakInstance.login;

const isLoggedIn = () => !!keycloakInstance.token;

const keycloakService = {
  callLogin: login,
  getUsername: username,
  getAccessToken: token,
  callLogout: logout,
  getUserRoles: userRoles,
  updateToken,
  isLoggedIn,
  instanceToken,
}

export default keycloakService;