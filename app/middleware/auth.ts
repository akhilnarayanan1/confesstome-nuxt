export default defineNuxtRouteMiddleware((to, from) => {
  const loggedIn = getIsLoggedIn();
  
  if (!loggedIn) {
    return navigateTo('/');
  }
});