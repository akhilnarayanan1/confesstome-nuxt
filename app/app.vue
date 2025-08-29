<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <Toast /> 
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
  import { useFirestore } from "vuefire";
  import { doc, getDoc } from "firebase/firestore";
  import type { FirestoreUserProfile, ToastData } from "@/assets/js/types";
  import type {User} from "firebase/auth";
    
  const auth = useFirebaseAuth()!;
  const db = useFirestore()!;

  let user: User;

  onMounted(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        await signInAnonymously(auth);
      } else {
        user = currentUser;
        loadProfile(currentUser);
      }
    });
  });

  const loadProfile = async (user: User) => {
    const querySnapshot = await getDoc(doc(db, "users", user.uid as string)).catch((err) => {
        addToast({
            message: err,
            type: "error",
            duration: 2000,
        } as ToastData);
    });

    if (!querySnapshot || !querySnapshot.exists()) {
      // Profile is incomplete, but still perform login so user can reach dashboard
      // where CompleteProfile component will handle the modal
      if (!getIsLoggedIn()) {
        performLogin();
      }
      return;
    };

    const { id, createdOn, name, username } = querySnapshot.data() as FirestoreUserProfile;
    setProfile({ id, createdOn, name, username });
    
    if (!getIsLoggedIn()) {
      performLogin();
    }

  };
</script>
