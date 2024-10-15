<template>
    <Navbar />
    <div v-if="loading.page || messagePending" class="flex justify-center m-4">
        <div class="skeleton h-32 w-full"></div>
    </div>
    <div v-else class="flex justify-center m-4">
        <div class="card bg-base-300 text-base-content w-full">
            <div class="card-body">
                <blockquote class="relative ps-4">
                    <p class="text-xl font-semibold"><em>{{ messageData?.message }}</em></p>
                    <div class="ms-4 mt-4">
                        <div class="font-light">{{ messageData?.from == currentUser?.uid ? 'you' : 'anonymous' }}</div>
                    </div>
                </blockquote>
            </div>
        </div>
    </div>
    <button @click="loadReplies" class="btn fixed top-0">Load Messages</button>

    <div v-if="repliesPending" class="flex justify-center m-4">
        <div class="skeleton h-24 w-full"></div>
    </div>
    <div v-else class="mx-4 mb-24">
        <div v-for="reply in replies">
            <div :class="reply.to == currentUser?.uid ? 'chat chat-start' : 'chat chat-end'">
                <div class="chat-image avatar">
                    <div class= "rounded-full mr-2" :style="{
                        'background-color': reply.fakecolor, 
                        'min-width': '32px', 
                        'min-height': '32px'
                    }"></div>
                </div>
                <div class="chat-header">
                    <p><em>{{ reply.from === currentUser?.uid ? 'you' : getUser }}</em></p>
                    <time class="text-xs">{{ reply.createdOn.toDate().toLocaleString() }}</time>
                </div>
                <div class="break-words chat-bubble bg-base-300 text-base-content">{{ reply.reply }}</div>
            </div>
        </div>  
        <div ref="scrollHook"></div>
    </div>
    
    <form id="searchUserForm" @submit.prevent="sendReply" class="w-full fixed bottom-0 p-4 bg-base-100 shadow-lg">
        <div class="input input-bordered flex items-center gap-2 w-full">
            <input v-model="form.send_reply" type="text" class="grow w-full p-2" placeholder="Type your message here..." />
            <button type="submit" class="btn btn-sm m-2">
                <span v-if="loading.send_reply" class="loading loading-spinner loading-sm"></span>
                <span v-else class="material-symbols-outlined">send</span>
            </button>
        </div>
        <InputLabel labelName="send_reply" />
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
    const db = useFirestore();
    const route = useRoute();

    const scrollHook = ref<HTMLElement | null>(null);
    const form = reactive({ send_reply: '' });
    const loading = reactive({ page: true, send_reply: false });
    const replies = ref<ReplyDetails[]>([]);
    const loadedTill = ref<DocumentData>();

    watchEffect(() => loading.page = currentUser == undefined);

    const { data: messageData, error: messageError, pending: messagePending } = useDocument<MessageDetails>(
        () => currentUser.value ? doc(db, "messages", route.query.cid as string) : null, { once: true });
    
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
        const newReplies = newRepliesData.filter((reply) => {
            return !replies.value.find((r) => r.id === reply.id);
        });
        replies.value.push(...newReplies);
        loadedTill.value = await getDoc(doc(db, "replies", replies.value[0].id))
        setTimeout(() => scrollTo(scrollHook), 1);
    }, { deep: true });
   
    const loadReplies = () => {
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
        }, {ssrKey: 'replies'}).promise.value.then(async (docs) => {
            _.forEach(docs, async(doc) => {
                if (!_.find(replies.value, ['id', doc.id])) {
                    replies.value.unshift(doc);
                }
            });
            loadedTill.value = await getDoc(doc(db, "replies", replies.value[0].id));
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
            addToast({
                message: "Reply sent successfully!",
                type: "success",
                duration: 3000,
            });
        }

        loading.send_reply = false;

    };  

    onBeforeRouteLeave(()=>{
        repliesStop()
        console.log("back pressed")
    })

</script>