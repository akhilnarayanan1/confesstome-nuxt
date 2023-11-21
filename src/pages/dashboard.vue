<template>
  <div>
    <div v-if="loading.page">
      Loading...
    </div>
    <div v-else>
      <Navbar />
      <CompleteProfile />

      <div class="alert alert-success text-black">
        <span>https://confessto.me/@{{ profile.username }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import { doc, getDoc } from "firebase/firestore";
  import { type User } from "firebase/auth";
  import { type FirestoreUserProfile, type ToastData } from "@/assets/js/types";

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts(); 

  const loading = reactive({ page: true });
  
  const currentUser = await getCurrentUser() as User | null | undefined;

  watchEffect(() => loading.page = currentUser == undefined);

  const profile: FirestoreUserProfile = reactive({ createdOn: "", name: "", username: "" });

  const db = useFirestore();

  onMounted(async ()=> {
  
    //Stop processing if user is blank
    if (!currentUser) {
      addToast({
        message: "Unknown error, Please try again (101)",
        type: "error",
        duration: 2000,
      } as ToastData);
      return;
    };

    const querySnapshot = await getDoc(doc(db, "users", currentUser?.uid as string));

    const { createdOn, name, username } = querySnapshot.data() as FirestoreUserProfile;

    profile.createdOn = createdOn;
    profile.name = name;
    profile.username = username;

  });
  




</script>