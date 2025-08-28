export const isLoggedIn = () => useCookie<boolean>('isLoggedIn', {
  default: () => false,
  httpOnly: false,
  secure: false,
  sameSite: 'lax'
});

export const getIsLoggedIn = () => computed(() => isLoggedIn()).value;

export const setLoggedIn = (value: boolean) => {
  isLoggedIn().value = value;
};

export const performSignout = () => {
  setLoggedIn(false);
  // Clear profile data when signing out
  const profileState = profile();
  profileState.value = { id: "", createdOn: "", name: "", username: "" };
  
  // Navigate to home page
  navigateTo('/');
};

export const performLogin = () => {
  setLoggedIn(true);
};