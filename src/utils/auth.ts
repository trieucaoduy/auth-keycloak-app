import Keycloak from "keycloak-js";

const CLIENT_ID = "vue-test-app"

interface CallbackOneParam<T1 = void, T2 = void> {
  (param1: T1): T2;
}

const keycloakInstance = new Keycloak({
  url: "http://localhost:8080/auth",
  realm: 'keycloak-demo',
  clientId: CLIENT_ID
});

const instance = {
  redirectUri: "http://localhost:5173",
  enableLogging: true,
  checkLoginIframe: false
}

const login = (onAuthenticatedCallback: CallbackOneParam) => {
  keycloakInstance
    .init({
      ...instance,
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

const token = (): string | undefined => keycloakInstance?.token;

const logout = () => keycloakInstance.logout();

const userRoles = (): string[] | undefined => {
  if (keycloakInstance?.resourceAccess === undefined) return undefined;
  if (keycloakInstance?.resourceAccess[CLIENT_ID] === undefined) return undefined;
  
  return keycloakInstance.resourceAccess[CLIENT_ID].roles;
}

const updateToken = (successCallback: any) => {
  keycloakInstance.updateToken(5).then(successCallback).catch(doLogin);
}

const doLogin = keycloakInstance.login;

const isLoggedIn = () => !!keycloakInstance.token;

const keycloakService = {
  callLogin: login,
  getUsername: username,
  getAccessToken: token,
  callLogout: logout,
  getUserRoles: userRoles,
  updateToken: updateToken,
  isLoggedIn: isLoggedIn
}

export default keycloakService;