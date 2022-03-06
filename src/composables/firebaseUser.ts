import { onAuthStateChanged, signInAnonymously, Auth } from "firebase/auth";
import { User } from "firebase/auth";

const firebaseUser = () => useState<User>("firebaseUser");
const isUserLoading = () => useState<boolean>("isUserLoading", () => true);
const isAuthenticated = () => useState<boolean>("isAuthenticated", () => false);

export const getUserData = () => {    
  const { $firebaseAuth } = useNuxtApp();
  onBeforeMount(() => {
    isUserLoading().value = true;
  });
  onMounted(() => {
    onAuthStateChanged($firebaseAuth, (currentUser) => {
      if (currentUser) {
        firebaseUser().value = currentUser;
        isAuthenticated().value = true;
        isUserLoading().value = false;
      } else {
        isUserLoading().value = false;
        anonymousSignIn($firebaseAuth);
      };
    });
  });
  return firebaseUser();
};

export const getUserDataPromised = (): Promise<User> => {
  const { $firebaseAuth } = useNuxtApp();
  return new Promise((resolve, reject) => {
    try {
      const unsubscribe = onAuthStateChanged($firebaseAuth, (user: User) => {
        resolve(user);
        unsubscribe();
      })
    } catch(err) {
      reject(err);
    };
  });
};

export const getIsUserLoading = () => isUserLoading();
export const getIsAuthenticated = () => isAuthenticated();
export const setIsAuthenticated = (authenticated: boolean) => isAuthenticated().value = authenticated;


const anonymousSignIn = async (auth: Auth) => {
  await signInAnonymously(auth);
};