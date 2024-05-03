<template>
    <div>
        
        <div v-if="loading.messages"><LoadingChats /></div>
        <div v-else>
          <Navbar />
          <!-- <ul class="menu bg-base-200 rounded-box m-4 shadow-md">
            <div v-for="(message) in messages" >
            <li>
              <h2 class="menu-title">{{message.from }}</h2>
              <ul>
                <li><a class="line-clamp-1"><p>{{ message.message }}</p></a></li> 
              </ul>
            </li>
            </div>
          </ul> -->
          <section class="flex flex-col justify-center p-4">
            <div class="h-full">
              <div class="relative mx-auto shadow-lg rounded-lg">
                <div class="py-3 px-5">
                  <h3 class="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                  <div class="">
                    <div v-for="message in messages">
                      <button class="w-full text-left hover:bg-slate-500 hover:rounded-lg p-2">
                        <div class="flex items-center">
                          <NuxtImg class="rounded-full items-start flex-shrink-0 mr-3" :height="32" :width="32" :src="message.fakeimage" alt="" />
                          <div>
                            <h4 class="text-sm font-semibold">{{ message.fakename }}</h4>
                            <div class="text-[13px] line-clamp-1">{{ message.message }}</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> 
        </div>
    </div>
</template>
<script setup lang="ts">
  import { useIsCurrentUserLoaded } from "vuefire";
  import type { ToastData, MessageDetails } from "@/assets/js/types";
  import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
  import _ from "lodash";

  const currentUser = useCurrentUser();
  const db = useFirestore();

  const loading = reactive({ messages: true })
  const messages = ref([] as MessageDetails[])

  const groupedByFrom = computed(() => _.groupBy(messages.value, (message) => message.from));

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
    const q = await query(
      collection(db, "messages"),
      where("to", "==", currentUser.value?.uid as string),
      orderBy("createdOn", "desc") // Order by "createdOn" in descending order
    );

    const querySnapshot = await getDocs(q);
    loading.messages = false;

    querySnapshot.forEach((doc) => {
      messages.value.push(doc.data() as MessageDetails);
    });


  };

  
</script>