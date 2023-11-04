<template>
  <div v-if="user.loading">
    Loading...
  </div>
  <div v-else-if="user.found">
    <!-- {{ user }} -->
    <div class="flex items-center justify-center h-screen">
      <div class="card shadow max-w-sm m-4">
        <div class="card-body">
          <div class="text-4xl font-bold mb-4">What's there for me</div>
          <form @submit.prevent="startThread">
            
            <div class="mb-4">Spill it out</div>

            <textarea v-model="message" placeholder="Bio" class="mb-4 textarea textarea-bordered textarea-lg w-full max-w-xs" ></textarea>
            <button type="submit" :class="loading.sendMessage ? 
            'btn btn-block glass bg-primary hover:bg-primary loading': 
            'btn btn-block glass bg-primary hover:bg-primary'">
              Send Confession
            </button>
          </form>
        </div>
      </div> 
    </div>
  </div>
  <div v-else>
    User Not Found
  </div>

  <!-- <div>{{ $route.params.user }}</div> -->
</template>

<script setup lang="ts">

  import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

  const db = useFirestore()!;
  const route = useRoute();

  const loading = reactive({ sendMessage: false});

  const message = ref("");

  const user = reactive({
    loading: true,
    found: false,
    name: "",
    username: "",
  });

  const startThread = () => {
    console.log(message.value)
  };

  onMounted(async ()=>{

    const q = query(collection(db, "users"), where("username", "==", route.params.user));
    const querySnapshot = await getDocs(q);

    user.loading = false;
    querySnapshot.empty ? user.found = false : user.found = true;

    if (user.found) {
      querySnapshot.forEach((doc) => {
        let userData = doc.data();
        user.name = userData.name;
        user.username = userData.username;
      });
    };
  
  });
  
</script>