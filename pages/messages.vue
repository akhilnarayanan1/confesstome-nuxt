<template>
    <div>
        <Navbar />
        <div v-if="loading.page || messagePending"><LoadingChats /></div>
        <div v-else>
          <section class="flex flex-col justify-center p-4">
            <div class="h-full">
              <div class="relative mx-auto shadow-lg rounded-lg">
                <div class="py-3 px-5 bg-base-300 bg-opacity-30 rounded-box text-white">
                  <h3 class="text-xs font-semibold uppercase mb-1">Chats</h3>
                    <div v-for="message in messageData">
                      <button class="w-full text-left hover:bg-base-100 hover:bg-opacity-40 hover:rounded-lg p-2" @click="navigateTo({
                        path: '/reply', query: {cid: message.id},
                      })">
                        <div class="flex items-center">
                          <div class= "rounded-full mr-2" :style="{'background-color': message.fakecolor, 'min-width': '32px', 'min-height': '32px' }"></div>
                          <div class="flex-grow">
                            <h4 class="text-sm font-semibold">{{ message.fakename }}</h4>
                            <div class="text-[13px] line-clamp-1">{{ message.message }}</div>
                          </div>
                        </div>
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </section> 
        </div>
    </div>
</template>
<script setup lang="ts">
  import type { ToastData, MessageDetails } from "@/assets/js/types";
  import { collection, query, where, orderBy } from "firebase/firestore";
  import { useCollection } from 'vuefire';

  const currentUser = useCurrentUser();
  const db = useFirestore();
  const route = useRoute();

  const loading = reactive({ page: true, messages: true })

  watchEffect(() => loading.page = currentUser == undefined);

  const mapper = (queryStr: "received" | "sent"): "from" | "to" => {
    if (queryStr === 'received') return "from";
    if (queryStr === 'sent') return "to";
    // Optionally, throw or handle unexpected input
    throw new Error("Invalid queryStr");
  }

  const sourceType = computed(() => {
    const sourceQuery = Array.isArray(route.query.source) ? route.query.source[0] : route.query.source;
    if (sourceQuery === "received") return "from";
    if (sourceQuery === "sent") return "to";
    navigateTo({ path: '/messages', query: { source: 'sent' } });
    return null;
  });

  const { data: messageData, error: messageError, pending: messagePending } = useCollection<MessageDetails>(
    () => {
      if (!currentUser.value) return null;
      return query(
        collection(db, "messages"),
        where(sourceType.value || "from", "==", currentUser.value.uid as string),
        orderBy("createdOn", "desc")
      );
    }, {ssrKey: `messages-${sourceType.value || "from"}`});


  watch(messageError, (newMessageError) => {
    addToast({
      message: newMessageError?.message,
      type: "error",
    } as ToastData);
  })
  
</script>