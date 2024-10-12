<template>
    <div>
        <Navbar />
        <div v-if="loading.page || messagePending"><LoadingChats /></div>
        <div v-else>
          <section class="flex flex-col justify-center p-4">
            <div class="h-full">
              <div class="relative mx-auto shadow-lg rounded-lg">
                <div class="py-3 px-5">
                  <h3 class="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                    <div v-for="message in messageData">
                      <button class="w-full text-left hover:bg-slate-500 hover:rounded-lg p-2" @click="navigateTo({
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
  import _ from "lodash";

  const currentUser = useCurrentUser();
  const db = useFirestore();

  const loading = reactive({ page: true, messages: true })
  const messages = ref([] as MessageDetails[])

  watchEffect(() => loading.page = currentUser == undefined);

  // const groupedByFrom = computed(() => _.groupBy(messages.value, (message) => message));

  const { data: messageData, error: messageError, pending: messagePending } = useCollection<MessageDetails>(
    () => currentUser.value 
      ? query(collection(db, "messages"),
      where("to", "==", currentUser.value.uid as string),
      orderBy("createdOn", "desc")
    ) : null, {ssrKey: 'messages', once: true});


  watch(messageError, (newMessageError) => {
    addToast({
      message: newMessageError?.message,
      type: "error",
    } as ToastData);
  })
  
</script>