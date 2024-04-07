<template>
    <div>
        
        <div v-if="loading.messages"><LoadingPage /></div>
        <div v-else>
          <Navbar />
          <div v-for="message in messages" :key="message.to">
              <div class="card outline outline-1 m-2">
                <div class="card-body">
                  <h2 class="card-title"><div>Anonymous</div><div>asdf</div></h2>
                  <p>{{ message.message }}</p>
                </div>
              </div>
          </div>
        </div>
    </div>
</template>
<script setup lang="ts">
  import { useIsCurrentUserLoaded } from "vuefire";
  import type { ToastData, MessageDetails } from "@/assets/js/types";
  import { collection, query, where, getDocs } from "firebase/firestore";

  const currentUser = useCurrentUser();
  const db = useFirestore();

  const loading = reactive({ messages: true })
  const messages = ref([] as MessageDetails[])

  onMounted(() => { 
    if (!useIsCurrentUserLoaded().value) {
      watch(currentUser, (newCurrentUser) => loadMessages());
    } else {
      loadMessages();
    }
  });

  const loadMessages = async () => {
    //Stop processing if user is blank
    if (!currentUser.value) {
        addToast({
          message: "Unknown error, Please try again (401)",
          type: "error",
          duration: 2000,
        } as ToastData);
        return;
      };
    loading.messages = true;
    const q = await query(collection(db, "messages"), where("to", "==", currentUser.value?.uid as string));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      loading.messages = false;
      messages.value.push(doc.data() as MessageDetails)
    });


  };

  
</script>