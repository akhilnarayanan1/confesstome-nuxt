<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <div class="relative z-10">
      <!-- Loading State -->
      <div v-if="loading.page || pendingOtherUser" class="flex items-center justify-center min-h-screen">
        <CircleLoad />
      </div>

      <!-- User Found - Confession Form -->
      <div v-else-if="dataOtherUser.length > 0" class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-lg w-full">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">🎭</div>
            <h1 class="text-4xl font-black mb-2">Anonymous Confession</h1>
            <div class="text-lg text-white/90 leading-relaxed">
              Spill the tea for <span class="font-black text-yellow-300">{{ dataOtherUser.at(0)?.name }}</span> 🔥
            </div>
          </div>

          <form id="formStartThread" @submit.prevent="startThread">
            <div class="form-control mb-6">
              <textarea 
                v-model="form.send_confession" 
                placeholder="💭 What's on your mind? Say anything... they'll never know it's you!"
                class="textarea w-full bg-white/10 border-2 border-white/30 hover:border-white/50 focus:border-yellow-300 rounded-2xl text-white placeholder-white/60 font-medium text-lg min-h-[120px] backdrop-blur-sm transition-all duration-300 resize-none"
              ></textarea>
              <InputLabel labelName="send_confession" />
            </div>

            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50"
              :disabled="loading.sendMessage"
            >
              <span v-if="loading.sendMessage" class="loading loading-spinner loading-sm"></span>
              <span v-else>🚀 Send Anonymous Confession</span>
            </button>
          </form>

          <!-- Fun Facts -->
          <div class="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">🔒</span>
              <span class="font-black text-yellow-300">100% Anonymous</span>
            </div>
            <div class="text-sm text-white/80 leading-relaxed">
              Your identity is completely hidden. They'll only see a randomly generated name and color. Go wild! 😈
            </div>
          </div>
        </div>
      </div>

      <!-- User Not Found -->
      <div v-else class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-orange-300/50 shadow-2xl max-w-sm w-full text-center">
          <div class="text-6xl mb-4">👻</div>
          <div class="text-2xl font-black mb-4 text-orange-300">User Not Found</div>
          <div class="text-white/90 leading-relaxed">
            This user doesn't exist or the link might be broken. Double-check the username! 🤔
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Feature Modal -->
    <div v-if="showChatFeatureModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-3xl font-black mb-3">Confession Sent!</h2>
          <p class="text-white/90 text-lg leading-relaxed">
            Your anonymous message has been delivered! 🚀
          </p>
        </div>

        <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-300/30 mb-6">
          <div class="flex items-start gap-4 mb-4">
            <div class="text-3xl">💬</div>
            <div>
              <h3 class="text-xl font-black text-yellow-300 mb-2">Want to Chat Back?</h3>
              <p class="text-white/90 leading-relaxed text-sm">
                Create an account to unlock <strong>anonymous chat conversations</strong>! When someone sends you confessions, you can reply and start secret chats. 🤫✨
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2 text-white/80">
              <span class="text-lg">🔒</span>
              <span>Stay Anonymous</span>
            </div>
            <div class="flex items-center gap-2 text-white/80">
              <span class="text-lg">💭</span>
              <span>Real-time Chat</span>
            </div>
            <div class="flex items-center gap-2 text-white/80">
              <span class="text-lg">📱</span>
              <span>Get Your Link</span>
            </div>
            <div class="flex items-center gap-2 text-white/80">
              <span class="text-lg">🎭</span>
              <span>Secret Identity</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <NuxtLink 
            to="/signup" 
            class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-6 rounded-full text-center transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50"
            @click="showChatFeatureModal = false"
          >
            🚀 Create Account & Unlock Chats
          </NuxtLink>
          
          <button 
            @click="showChatFeatureModal = false"
            class="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            ✨ Maybe Later
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FirestoreUserProfile, ToastData } from "@/assets/js/types";
  import { collection, query, where, serverTimestamp, addDoc } from "firebase/firestore";
  import { SendConfession } from "@/assets/js/forms";
  import { getFakeNameAndImage } from "@/assets/js/functions";

  const db = useFirestore()!;
  const route = useRoute();

  const loading = reactive({ page: true, sendMessage: false});
  const showChatFeatureModal = ref(false);

  const currentUser = useCurrentUser();

  watchEffect(() => loading.page = currentUser.value == undefined);

  const form = reactive({ send_confession: ''});

  const {data: dataOtherUser, error: errorOtherUser, pending: pendingOtherUser} = useCollection<FirestoreUserProfile>(
    () => (currentUser.value)
    ? query(collection(db, "users"), where("username", "==", route.params.user))
    : null
  );

  watch(errorOtherUser, (newErrorOtherUser) => {
    addToast({
        message: newErrorOtherUser?.message,
        type: "error",
        duration: 2000,
    } as ToastData);
  });

  const startThread = async () => {

    //Stop processing if user is blank
    if(currentUser.value == undefined) {
      // Don't show error during initial auth - just return silently
      loading.sendMessage = false;
      return;
    };

    //Stop processing if any UI error
    const sendConfession = new SendConfession(form);
    if (!sendConfession.checkFormValid()) return;

    loading.sendMessage = true;

    if (dataOtherUser.value.at(0)?.id === currentUser.value?.uid) {
      addToast({
        message: "You can't send message to yourself.",
        type: "error",
        duration: 3000,
      })
      loading.sendMessage = false;
      return;
    };

    const {fakename, fakecolor} = getFakeNameAndImage(currentUser.value.uid);

    const reponse = await addDoc((collection(db, "messages")), {
      to: dataOtherUser.value.at(0)?.id,
      from: currentUser.value?.uid as string,
      message: form.send_confession,
      toName: dataOtherUser.value.at(0)?.name,  // Store recipient's name
      createdOn: serverTimestamp(),
      fakename: fakename,
      fakecolor: fakecolor,
    }).catch((err) => {
      addToast({
        message: err,
        type: "error",
        duration: 2000,
      } as ToastData);
    });

    if (reponse) {
      // Check if user is anonymous (not verified/logged in properly)
      const isAnonymousUser = currentUser.value?.isAnonymous || !currentUser.value?.emailVerified;
      
      if (isAnonymousUser) {
        // Show chat feature modal for anonymous users
        showChatFeatureModal.value = true;
      } else {
        // Regular success toast for verified users
        addToast({
          message: "Message sent successfully!",
          type: "success",
          duration: 3000,
        });
      }
    };

    form.send_confession = "";
    loading.sendMessage = false;
  };
  
</script>