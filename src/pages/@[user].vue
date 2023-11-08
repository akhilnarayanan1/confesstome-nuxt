<template>
  <div v-if="otherUser.loading">
    Loading...
  </div>
  <div v-else-if="otherUser.found">
    <!-- {{ user }} -->
    <div class="flex items-center justify-center h-screen">
      <div class="card shadow max-w-sm m-4">
        <div class="card-body">
          <div class="text-4xl font-bold mb-4">What's there for me</div>
          <form @submit.prevent="startThread">
            
            <div class="mb-4">Spill it out for {{ otherUser.name }}</div>

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
  import { type ToastData } from "@/assets/js/types";
  import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

  const db = useFirestore()!;
  const route = useRoute();

  const loading = reactive({ sendMessage: false});

  const message = ref("");

  const otherUser = reactive({ loading: true, found: false, name: "", username: "" });

  const startThread = async () => {
    const currentUser = firebaseUser().value || await getUserDataPromised();

    //Stop processing if user is blank
    if(!currentUser){
      addToast({
        message: "Unknown error, Please try again (101)",
        type: "error",
        duration: 2000,
      } as ToastData);
      return;
    };
    console.log(message.value)
  };

  onMounted(async ()=>{

    const q = query(collection(db, "users"), where("username", "==", route.params.user));
    const querySnapshot = await getDocs(q);

    otherUser.loading = false;
    querySnapshot.empty ? otherUser.found = false : otherUser.found = true;

    if (!querySnapshot.empty){
      const { name, username } =  querySnapshot.docs[0].data()
      otherUser.name = name
      otherUser.username = username
    }
  
  });
  
</script>