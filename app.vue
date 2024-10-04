<template>
  <div>
    <NuxtPage />
    <Toast /> 
    <CompleteProfile @load-profile="loadProfile(user)" />
    {{ getProfile() }}
  </div>
</template>

<script setup lang="ts">
  import { onAuthStateChanged, signInAnonymously, type Auth } from "firebase/auth";
  import { useFirestore } from "vuefire";
  import { doc, getDoc } from "firebase/firestore";
  import type { FirestoreUserProfile, ToastData } from "@/assets/js/types";
  import type {User} from "firebase/auth";
    
  const auth = useFirebaseAuth()!;
  const db = useFirestore();

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
    const querySnapshot = await getDoc(doc(db, "users", user.uid as string));

    if (!querySnapshot.exists()) {
      addToast({
        message: "Please complete your profile to continue.",
        type: "error",
        duration: 2000,
      } as ToastData);
      return;
    };

    const { createdOn, name, username } = querySnapshot.data() as FirestoreUserProfile;
    setProfile({ createdOn, name, username });

  };
</script>
