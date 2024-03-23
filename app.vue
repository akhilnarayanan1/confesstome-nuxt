<template>
  <div>
    <NuxtPage />
    <Toast /> 
  </div>
</template>

<script setup lang="ts">
  // load anonymous user
  import { onAuthStateChanged, signInAnonymously, type Auth } from "firebase/auth";
    
  const auth = useFirebaseAuth()!;
  onMounted(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        await signInAnonymously(auth);
      };
    });
  });

</script>
