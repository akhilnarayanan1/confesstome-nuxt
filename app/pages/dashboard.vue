<template>
  <Dashboard />
  <CompleteProfile :active="true" @load-profile="loadProfile" />
</template>

<script setup lang="ts">
  import { doc, getDoc } from "firebase/firestore";
  import type { FirestoreUserProfile, ToastData } from "@/assets/js/types";

  definePageMeta({ layout: 'app' });

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts(); 

  const profile = getProfile();
  const db = useFirestore()!;

  const currentUser = useCurrentUser();

  const loadProfile = async () => {
    if (!currentUser.value) return;
    
    const querySnapshot = await getDoc(doc(db, "users", currentUser.value.uid as string)).catch((err) => {
        addToast({
            message: err,
            type: "error",
            duration: 2000,
        } as ToastData);
    });

    if (!querySnapshot || !querySnapshot.exists()) {
      return;
    };

    const { id, createdOn, name, username } = querySnapshot.data() as FirestoreUserProfile;
    setProfile({ id, createdOn, name, username });
  };

</script>