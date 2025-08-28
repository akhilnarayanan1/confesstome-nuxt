<template>
            
            <!-- Original Message Card -->
            <div v-if="messagePending" class="flex justify-center m-4">
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl h-32 w-full animate-pulse"></div>
            </div>
            <div v-else class="flex justify-center m-4">
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-yellow-300/50 shadow-2xl w-full">
                    <div class="flex items-start gap-4">
                        <div class="text-4xl">💬</div>
                        <div>
                            <div class="text-lg font-black text-yellow-300 mb-2">Original Confession</div>
                            <blockquote class="text-white/90 leading-relaxed italic">
                                "{{ messageData?.message }}"
                            </blockquote>
                            <div class="mt-4 text-sm text-white/70">
                                — {{ messageData?.from == currentUser?.uid ? 'you' : 'anonymous' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Chat Messages -->
            <div v-if="messagePending || repliesPending" class="flex justify-center m-4">
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl h-24 w-full animate-pulse"></div>
            </div>
            <div v-else class="mx-4 pb-32">
                <div class="flex justify-center mb-4">
                    <button v-if="loadMoreMessage.button" @click="loadReplies" class="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 border border-white/30">
                        📜 Load More Messages
                    </button>
                    <span v-if="loadMoreMessage.loading" class="loading loading-spinner loading-md text-yellow-300"></span>
                </div>
                
                <div v-for="reply in replies" :key="reply.id" class="mb-4">
                    <div :class="reply.to == currentUser?.uid ? 'flex justify-start' : 'flex justify-end'">
                        <div :class="{
                            'max-w-xs lg:max-w-md px-6 py-4 rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105': true,
                            'bg-white/10 backdrop-blur-lg border border-pink-300/50': reply.to == currentUser?.uid,
                            'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border border-yellow-300/50': reply.to != currentUser?.uid
                        }">
                            <div class="flex items-start gap-3">
                                <div class="rounded-full min-w-[32px] min-h-[32px] flex-shrink-0 border-2 border-white/30" :style="{'background-color': reply.fakecolor}"></div>
                                <div class="flex-grow">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="font-black text-sm text-yellow-300">
                                            {{ reply.from === currentUser?.uid ? 'You' : getUser }}
                                        </span>
                                        <time class="text-xs text-white/60">{{ reply.createdOn.toDate().toLocaleTimeString() }}</time>
                                    </div>
                                    <div class="text-white/90 leading-relaxed break-words">{{ reply.reply }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                <div ref="scrollHook"></div>
            </div>
            
            <!-- Message Input - Only show if sender is verified -->
            <form v-if="messageData?.from && !isAnonymousSender" id="searchUserForm" @submit.prevent="sendReply" class="w-full fixed bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-lg border-t border-white/20">
                <div class="max-w-6xl mx-auto">
                    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
                        <div class="flex items-center gap-4">
                            <input 
                                v-model="form.send_reply" 
                                type="text" 
                                class="flex-grow bg-white/5 border-2 border-white/30 focus:border-yellow-300 rounded-xl px-4 py-3 text-white placeholder-white/60 font-medium transition-all duration-300" 
                                placeholder="💭 Type your reply here..." 
                            />
                            <button 
                                type="submit" 
                                class="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50 min-w-[50px]"
                                :disabled="loading.send_reply"
                            >
                                <span v-if="loading.send_reply" class="loading loading-spinner loading-sm"></span>
                                <span v-else class="text-xl">🚀</span>
                            </button>
                        </div>
                        <InputLabel labelName="send_reply" />
                    </div>
                </div>
            </form>
</template>

<script setup lang="ts">

    import { getFakeNameAndImage, getFromAndTo, scrollTo } from '@/assets/js/functions';
    import type { ToastData, MessageDetails, ReplyDetails, FirestoreUserProfile } from "@/assets/js/types";
    import { SendReply } from "@/assets/js/forms";
    import { useCollection, useDocument } from 'vuefire';
    import { collection, query, where, orderBy, doc, addDoc, serverTimestamp, or, and, limit, getDoc, limitToLast, startAfter } from "firebase/firestore";
    import type { DocumentData} from "firebase/firestore";
    import _ from "lodash";

    const currentUser = useCurrentUser();
    const db = useFirestore()!;
    const route = useRoute();

    const scrollHook = ref<HTMLElement | null>(null);
    const form = reactive({ send_reply: '' });
    const loading = reactive({ send_reply: false });
    const replies = ref<ReplyDetails[]>([]);
    const loadedTill = ref<DocumentData>();
    const loadMoreMessage = reactive({button: false, loading: false});

    // Check if we should hide reply form - hide if other person is anonymous/unverified
    const isAnonymousSender = computed(() => {
        if (!messageData.value || !currentUser.value || !userData.value) return true;
        
        // Find the other person in the conversation (not current user)
        const otherPerson = userData.value.find(user => user.id !== currentUser.value?.uid);
        
        // If we can't find the other person's profile, assume they're anonymous
        if (!otherPerson) return true;
        
        // Hide reply form if the other person doesn't have a complete profile
        // (which indicates they're anonymous/unverified)
        return !otherPerson.name || !otherPerson.username;
    });

    definePageMeta({ layout: 'app' });

    const { data: messageData, error: messageError, pending: messagePending } = useDocument<MessageDetails>(
        () => (route.query.cid && currentUser.value) 
        ? doc(db, "messages", route.query.cid as string) 
        : null, { once: true });
    
    const {data: userData, error: userError, pending: userPending } = useCollection<FirestoreUserProfile>(
        () => (messageData.value && currentUser.value)
        ? query(collection(db, "users"), where("__name__", "in", [messageData.value.from, messageData.value.to]))
        : null, { once: true, ssrKey: 'userData' });

    const getUser = computed(() => {
        if(!currentUser.value && !messageData.value && !userData.value) {
            return "loading";
        }
        return (messageData.value?.from === currentUser.value?.uid) 
        ?  _.first(_.reject(userData.value, ['id', currentUser.value?.uid]))?.name : "anonymous"
    });

    const { data: repliesData, error: repliesError, pending: repliesPending, stop: repliesStop } = useCollection<ReplyDetails>( 
    () => {
        if (messageData.value && currentUser.value) {
            if ((messageData.value.from == currentUser.value.uid) || (messageData.value.to == currentUser.value.uid)) {
                return query(
                    collection(db, "replies"),
                    and(
                        where("cid", "==", route.query.cid as string),
                        or(
                            where("from", "==", currentUser.value.uid),
                            where("to", "==", currentUser.value.uid),
                        ),
                    ),
                    orderBy("createdOn", "asc"), 
                    limitToLast(3)
                )
            } else {
                addToast({ message: "Invalid user", type: "error" } as ToastData);
                return null;
            }
        }
        return null;
    }, {ssrKey: 'replies'});

    watch(repliesData, async (newRepliesData) => {
        if (newRepliesData && newRepliesData.length > 0) {
            const newReplies = newRepliesData.filter((reply) => {
                return !replies.value.find((r) => r.id === reply.id);
            });
            if (newReplies.length > 0) {
                replies.value.push(...newReplies);
                if (replies.value.length > 0 && replies.value[0]) {
                    loadedTill.value = await getDoc(doc(db, "replies", replies.value[0].id));
                }
                setTimeout(() => scrollTo(scrollHook), 1);
            }
            loadMoreMessage.button = newRepliesData.length >= 3;
        } else {
            loadMoreMessage.button = false;
        }
        loadMoreMessage.loading = false;
    }, { deep: true });
   
    const loadReplies = () => {
        loadMoreMessage.loading = true
        loadMoreMessage.button = false
        useCollection<ReplyDetails>( 
            () => {
            if (messageData.value && currentUser.value) {
                if ((messageData.value.from == currentUser.value.uid) || (messageData.value.to == currentUser.value.uid) || (replies.value.length > 0)) {
                    return query(
                        collection(db, "replies"),
                        and(
                            where("cid", "==", route.query.cid as string),
                            or(where("from", "==", currentUser.value?.uid), where("to", "==", currentUser.value?.uid)),
                        ),
                        orderBy("createdOn", "desc"),
                        startAfter(loadedTill.value),
                        limit(3)
                    );
                } else {
                    addToast({ message: "Invalid user", type: "error" } as ToastData);
                    return null;
                }
            }
            return null;
        }, {ssrKey: 'replies'}).promise.value.then(async (newRepliesData) => {
            if (newRepliesData && newRepliesData.length > 0) {
                const newReplies = newRepliesData.filter((reply) => {
                    return !replies.value.find((r) => r.id === reply.id);
                });
                if (newReplies.length > 0) {
                    replies.value.unshift(...newReplies.reverse());
                    if (replies.value.length > 0 && replies.value[0]) {
                        loadedTill.value = await getDoc(doc(db, "replies", replies.value[0].id));
                    }
                }
                loadMoreMessage.button = newRepliesData.length >= 3;
            } else {
                loadMoreMessage.button = false;
            }
            loadMoreMessage.loading = false;
        });
    };

    const sendReply = async () => {
        //Stop processing if user is blank
        if (!currentUser.value) {
            addToast({
                message: "Unknown error, Please try again (401)",
                type: "error",
                duration: 2000,
            } as ToastData);
            return;
        };

        if (!messageData.value) {
            addToast({
                message: "Unknown error, Please try again (422)",
                type: "error",
                duration: 2000,
            } as ToastData);
            return;
        };

        //Stop processing if any UI error
        const sendConfession = new SendReply(form);
        if (!sendConfession.checkFormValid()) return;

        loading.send_reply = true;

        const message = form.send_reply;
        form.send_reply = "";

        const {fakecolor, fakename} = getFakeNameAndImage(currentUser.value.uid);

        const {from, to} = getFromAndTo(messageData.value, currentUser.value);

        const formData = {
            cid: route.query.cid,
            from: from,
            to: to,
            reply: message,
            fakename: fakename,
            fakecolor: fakecolor,
            createdOn: serverTimestamp()
        }

        const response = await addDoc((collection(db, "replies")), formData as ReplyDetails)
        .catch((err) => {
            addToast({
                message: err,
                type: "error",
                // duration: 2000,
            } as ToastData);
            form.send_reply = message;
        });

        if (response) {
            addFieldAlert({
                message: "Reply sent successfully!",
                type: "success",
                fieldid: "send_reply",
                source: "server"
            })
        }

        loading.send_reply = false;

    };  

    onBeforeRouteLeave(()=>{
        repliesStop()
        console.log("back pressed")
    })

</script>