import { onAuthStateChanged, signInAnonymously, type Auth } from "firebase/auth";
import { type User } from "firebase/auth";

export const firebaseUser = () => useState<User>("firebaseUser");

export const getUserData = () => {
  const auth = useFirebaseAuth()!;
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        firebaseUser().value = currentUser;
      } else {
        anonymousSignIn(auth)
      };
    });
  });
  return firebaseUser();
};

export const getUserDataPromised = (): Promise<User> => {
  return new Promise(async(resolve, reject) => {
    try{
      const user = await getCurrentUser()
      firebaseUser().value = user;
      resolve(user);
    } catch (err) {
      reject(err);
    }
  })
};

const anonymousSignIn = async (auth: Auth) => {
  await signInAnonymously(auth);
};