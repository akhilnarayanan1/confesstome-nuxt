<template>
  <div>{{ $route.params.user }}</div>
  {{ user }}
  <!-- <div>
    {{ user }}
  </div> -->
</template>

<script setup lang="ts">

  import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

  const { $firebaseDB } = useNuxtApp();
  const route = useRoute();

  const user = reactive({
    loading: true,
    found: false,
    name: "",
    username: "",
  });

  onMounted(async ()=>{

    const q = query(collection($firebaseDB, "users"), where("username", "==", route.params.user));
    // const userData = (await getDocs(q)).docs[0].data();
    const querySnapshot = await getDocs(q);

    user.loading = false;
    querySnapshot.empty ? user.found = false : user.found = true;
  
  })
  
</script>