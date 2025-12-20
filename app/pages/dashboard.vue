<template>
  <Dashboard />
  <CompleteProfile :active="showCompleteProfile" @load-profile="loadProfile" />
</template>

<script setup lang="ts">
  import { doc, getDoc } from "firebase/firestore";
  import type { FirestoreUserProfile, ToastData } from "@/assets/js/types";

  definePageMeta({ layout: 'app', middleware: 'auth' });

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts(); 

  const profile = getProfile();
  const db = useFirestore()!;
  const router = useRouter();

  const currentUser = useCurrentUser();
  const showCompleteProfile = ref(false);

  // Check if user is logged in, redirect with alert if not
  watchEffect(() => {
    const loggedIn = getIsLoggedIn();
    if (loggedIn.value === false) {
      addToast({
        message: "Please login to access dashboard",
        type: "error",
        duration: 3000,
      } as ToastData);
      router.push('/');
    }
  });

  // Check if profile needs to be completed
  watchEffect(async () => {
    if (!currentUser.value) return;
    
    const querySnapshot = await getDoc(doc(db, "users", currentUser.value.uid as string)).catch(() => null);
    
    // Show complete profile modal only if profile is incomplete
    showCompleteProfile.value = !querySnapshot || !querySnapshot.exists() || 
                                !querySnapshot.data()?.name || !querySnapshot.data()?.username;
  });

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
    
    // Hide complete profile modal after successful load
    showCompleteProfile.value = false;
  };

</script>