<template>
  <div>
    <div v-if="loading.page"><LoadingPage /></div>
    <div v-else>
      <Navbar />
      <CompleteProfile @load-profile.once="loadProfile" />
      <div v-if="!profile.username" class="skeleton h-14"></div>
      <div v-else class="alert alert-success">
        <span>https://confessto.me/@{{ profile.username }}</span>
        <span class="material-symbols-outlined">content_copy</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import { doc, getDoc } from "firebase/firestore";
  import type {  FirestoreUserProfile, ToastData } from "@/assets/js/types";
  import { useFirestore, useIsCurrentUserLoaded } from "vuefire";

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts(); 

  const loading = reactive({ page: true });
  const profile: FirestoreUserProfile = reactive({ createdOn: "", name: "", username: "" });

  const currentUser = useCurrentUser();
  const db = useFirestore();

  watchEffect(() => loading.page = currentUser == undefined);

  onMounted(() => { 
    if (!useIsCurrentUserLoaded().value) {
      watch(currentUser, (newCurrentUser) => loadProfile());
    } else {
      loadProfile();
    }
  });

  const loadProfile = async () => {
    //Stop processing if user is blank
    if (!currentUser.value) {
        addToast({
          message: "Unknown error, Please try again (401)",
          type: "error",
          duration: 2000,
        } as ToastData);
        return;
      };
    const querySnapshot = await getDoc(doc(db, "users", currentUser.value?.uid as string));

    if (!querySnapshot.exists()) {
      addToast({
        message: "Please complete your profile to continue.",
        type: "error",
        duration: 2000,
      } as ToastData);
      return;
    };

    const { createdOn, name, username } = querySnapshot.data() as FirestoreUserProfile;

    profile.createdOn = createdOn;
    profile.name = name;
    profile.username = username;
  };

</script>