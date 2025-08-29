<template>
            <div v-if="messagePending" class="flex justify-center p-4">
                <LoadingChats />
            </div>
            <div v-else class="p-4">
                <div class="max-w-4xl mx-auto">
                    <!-- Header -->
                    <div class="text-center mb-8">
                        <div class="text-6xl mb-4">💬</div>
                        <h1 class="text-4xl font-black mb-2">Your Chats</h1>
                        <p class="text-white/70 text-lg">All your anonymous conversations in one place</p>
                    </div>

                    <!-- Chat List -->
                    <div class="space-y-6">
                        <!-- Empty State -->
                        <div v-if="!messageData || messageData.length === 0" class="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-16 text-center">
                            <div class="text-6xl mb-4">👻</div>
                            <div class="text-2xl font-black mb-2 text-white/80">No chats yet!</div>
                            <div class="text-white/60">Start some anonymous conversations to see them here</div>
                        </div>
                        
                        <!-- For Sent Messages or when no received messages separation needed -->
                        <div v-else-if="sourceType === 'from'" class="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
                            <div class="p-6 border-b border-white/10">
                                <h3 class="text-lg font-black text-yellow-300 flex items-center gap-2">
                                    <span class="text-2xl">📤</span>
                                    Messages Sent
                                </h3>
                            </div>
                            
                            <div v-for="message in messageData" :key="message.id">
                                <button 
                                    class="w-full text-left p-6 border-b border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group"
                                    @click="navigateTo({
                                        path: '/reply', 
                                        query: {cid: message.id},
                                    })"
                                >
                                    <div class="flex items-center gap-4">
                                        <div 
                                            class="rounded-full min-w-[48px] min-h-[48px] flex-shrink-0 border-3 border-white/30 group-hover:border-yellow-300/50 transition-all duration-300"
                                            :style="{'background-color': message.fakecolor}"
                                        ></div>
                                        
                                        <div class="flex-grow min-w-0">
                                            <div class="flex items-center justify-between mb-2">
                                                <h4 class="font-black text-lg text-yellow-300 truncate group-hover:text-yellow-200 transition-colors">
                                                    {{ message.toName ? `💌 to ${message.toName}` : `💌 to @....${message.to.slice(-8)}` }}
                                                </h4>
                                                <span class="text-xs text-white/50 font-medium">
                                                    {{ new Date(message.createdOn.toDate()).toLocaleDateString() }}
                                                </span>
                                            </div>
                                            <div class="text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                                                "{{ message.message }}"
                                            </div>
                                            <div class="mt-2">
                                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-300/30">
                                                    <span class="text-pink-300">💭</span>
                                                    Sent
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div class="text-white/40 group-hover:text-white/80 transition-colors text-2xl">→</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- For Received Messages - Two Sections -->
                        <div v-else class="space-y-6">
                            <!-- Interactive Chats (Verified → Verified) -->
                            <div v-if="verifiedMessages.length > 0" class="bg-white/10 backdrop-blur-lg rounded-3xl border border-green-300/50 overflow-hidden">
                                <div class="p-6 border-b border-white/10">
                                    <h3 class="text-lg font-black text-green-300 flex items-center gap-2">
                                        <span class="text-2xl">💬</span>
                                        Interactive Chats
                                    </h3>
                                    <p class="text-sm text-white/70 mt-1">You can reply to these conversations</p>
                                </div>
                                
                                <div v-for="message in verifiedMessages" :key="message.id">
                                    <button 
                                        class="w-full text-left p-6 border-b border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group"
                                        @click="navigateTo({
                                            path: '/reply', 
                                            query: {cid: message.id},
                                        })"
                                    >
                                        <div class="flex items-center gap-4">
                                            <div 
                                                class="rounded-full min-w-[48px] min-h-[48px] flex-shrink-0 border-3 border-green-300/30 group-hover:border-green-300/50 transition-all duration-300"
                                                :style="{'background-color': message.fakecolor}"
                                            ></div>
                                            
                                            <div class="flex-grow min-w-0">
                                                <div class="flex items-center justify-between mb-2">
                                                    <h4 class="font-black text-lg text-green-300 truncate group-hover:text-green-200 transition-colors">
                                                        👤 {{ message.fakename }}
                                                    </h4>
                                                    <span class="text-xs text-white/50 font-medium">
                                                        {{ new Date(message.createdOn.toDate()).toLocaleDateString() }}
                                                    </span>
                                                </div>
                                                <div class="text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                                                    "{{ message.message }}"
                                                </div>
                                                <div class="mt-2">
                                                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/30">
                                                        <span class="text-green-300">💬</span>
                                                        Can Reply
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div class="text-green-300/60 group-hover:text-green-300 transition-colors text-2xl">💬</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- Read-Only Messages (Anonymous → Verified) -->
                            <div v-if="anonymousMessages.length > 0" class="bg-white/10 backdrop-blur-lg rounded-3xl border border-orange-300/50 overflow-hidden">
                                <div class="p-6 border-b border-white/10">
                                    <h3 class="text-lg font-black text-orange-300 flex items-center gap-2">
                                        <span class="text-2xl">👁️</span>
                                        Read-Only Messages
                                    </h3>
                                    <p class="text-sm text-white/70 mt-1">Anonymous confessions - view only</p>
                                </div>
                                
                                <div v-for="message in anonymousMessages" :key="message.id">
                                    <button 
                                        class="w-full text-left p-6 border-b border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group"
                                        @click="navigateTo({
                                            path: '/reply', 
                                            query: {cid: message.id},
                                        })"
                                    >
                                        <div class="flex items-center gap-4">
                                            <div 
                                                class="rounded-full min-w-[48px] min-h-[48px] flex-shrink-0 border-3 border-orange-300/30 group-hover:border-orange-300/50 transition-all duration-300"
                                                :style="{'background-color': message.fakecolor}"
                                            ></div>
                                            
                                            <div class="flex-grow min-w-0">
                                                <div class="flex items-center justify-between mb-2">
                                                    <h4 class="font-black text-lg text-orange-300 truncate group-hover:text-orange-200 transition-colors">
                                                        🎭 {{ message.fakename }}
                                                    </h4>
                                                    <span class="text-xs text-white/50 font-medium">
                                                        {{ new Date(message.createdOn.toDate()).toLocaleDateString() }}
                                                    </span>
                                                </div>
                                                <div class="text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                                                    "{{ message.message }}"
                                                </div>
                                                <div class="mt-2">
                                                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-300/30">
                                                        <span class="text-orange-300">👁️</span>
                                                        View Only
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div class="text-orange-300/60 group-hover:text-orange-300 transition-colors text-2xl">👁️</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</template>
<script setup lang="ts">
  import type { ToastData, MessageDetails, FirestoreUserProfile } from "@/assets/js/types";
  import { collection, query, where, orderBy } from "firebase/firestore";
  import { useCollection } from 'vuefire';
  import _ from "lodash";

  definePageMeta({ layout: 'app', middleware: 'auth' });

  const currentUser = useCurrentUser();
  const db = useFirestore()!;
  const route = useRoute();

  const mapper = (queryStr: "received" | "sent"): "from" | "to" => {
    if (queryStr === 'received') return "from";
    if (queryStr === 'sent') return "to";
    // Optionally, throw or handle unexpected input
    throw new Error("Invalid queryStr");
  }

  const sourceType = computed(() => {
    const sourceQuery = Array.isArray(route.query.source) ? route.query.source[0] : route.query.source;
    if (sourceQuery === "received") return "to";   // Messages TO current user (received by them)
    if (sourceQuery === "sent") return "from";     // Messages FROM current user (sent by them)
    return "from"; // Default to "from" (sent messages)
  });

  const { data: messageData, error: messageError, pending: messagePending } = useCollection<MessageDetails>(
    () => {
      if (!currentUser.value) return null;
      return query(
        collection(db, "messages"),
        where(sourceType.value, "==", currentUser.value.uid as string),
        orderBy("createdOn", "desc")
      );
    }, {ssrKey: `messages-${sourceType.value}`});

  // Get user profiles for verification check (only for received messages)
  const { data: usersData } = useCollection<FirestoreUserProfile>(
    () => {
      if (!currentUser.value || !messageData.value || sourceType.value !== "to") return null;
      
      // Get unique sender IDs from received messages
      const senderIds = [...new Set(messageData.value.map(msg => msg.from))];
      if (senderIds.length === 0) return null;
      
      return query(
        collection(db, "users"),
        where("__name__", "in", senderIds)
      );
    }, { ssrKey: `users-${sourceType.value}` }
  );

  // Separate messages into verified and anonymous sections (only for received messages)
  const verifiedMessages = computed(() => {
    if (!messageData.value || sourceType.value !== "to" || !usersData.value) return messageData.value || [];
    
    return messageData.value.filter(message => {
      const senderProfile = usersData.value?.find(user => user.id === message.from);
      return senderProfile && senderProfile.name && senderProfile.username;
    });
  });

  const anonymousMessages = computed(() => {
    if (!messageData.value || sourceType.value !== "to" || !usersData.value) return [];
    
    return messageData.value.filter(message => {
      const senderProfile = usersData.value?.find(user => user.id === message.from);
      return !senderProfile || !senderProfile.name || !senderProfile.username;
    });
  });



  watch(messageError, (newMessageError) => {
    addToast({
      message: newMessageError?.message,
      type: "error",
    } as ToastData);
  })
  
</script>