<template>
    <Navbar />
    <div v-if="messagePending" class="flex justify-center m-4">
        <div class="skeleton h-24 w-full"></div>
    </div>
    <div v-else class="flex justify-center m-4">
        <div class="card bg-base-300 text-base-content w-full">
            <div class="card-body">
                <h2 v-if="isme" class="card-title"><i>From you</i></h2>
                <h2 v-else class="card-title"><i>From anonymous</i></h2>
                <p>{{ messageData?.message }}</p>
            </div>
        </div>
    </div>
    <div v-if="repliesPending" class="flex justify-center m-4">
        <div class="skeleton h-24 w-full"></div>
    </div>
    <div v-else class="mx-4 mb-24">
        <div v-for="reply in repliesData">
            <div :class="reply.from !== currentUser?.uid ? 'chat chat-start' : 'chat chat-end'">
                <div class="chat-image avatar">
                    <div class= "rounded-full mr-2" :style="{'background-color': reply.fakecolor, 'min-width': '32px', 'min-height': '32px' }"></div>
                </div>
                <div class="chat-header">{{ reply.fakename }} &nbsp;<time class="text-xs">{{ reply.createdOn.toDate().toLocaleString() }}</time></div>
                <div class="chat-bubble bg-base-300 text-base-content">{{ reply.reply }}</div>
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

    import type { ToastData, MessageDetails, ReplyDetails } from "@/assets/js/types";
    import type { DocumentData } from 'firebase/firestore'
    import { collection, query, where, orderBy, doc, addDoc, serverTimestamp, or, and, onSnapshot } from "firebase/firestore";
    import _ from "lodash";
    import { SendReply } from "@/assets/js/forms";
    import { getFakeNameAndImage } from '@/assets/js/functions';
    import { useCollection, useDocument, firestoreDefaultConverter } from 'vuefire';

    const currentUser = useCurrentUser();
    const db = useFirestore();
    const route = useRoute();

    const scrollHook = ref<HTMLElement | null>(null);
    const isme = ref(false);
    const form = reactive({ send_reply: '' });

    const loading = reactive({ page: true, send_reply:false });

    // Using scrollIntoView() function to achieve the scrolling
    const scrollTo = (view: Ref<HTMLElement | null>) => { 
        view.value?.scrollIntoView({ behavior: 'smooth' }) 
    };

    watchEffect(() => loading.page = currentUser == undefined);

    const { data: messageData, error: messageError, pending: messagePending } = useDocument<MessageDetails>(
        () => currentUser.value ? doc(db, "messages", route.query.cid as string) : null, { once: true });

    const { data: repliesData, error: repliesError, pending: repliesPending, stop: repliesStop } = useCollection<ReplyDetails>( 
    () => {
        if (messageData.value && currentUser.value) {
            if ((messageData.value.from == currentUser.value.uid) || (messageData.value.to == currentUser.value.uid)) {
                return query(    
                    collection(db, "replies"),
                    where("cid", "==", route.query.cid as string),
                    orderBy("createdOn", "asc") // Order by "createdOn" in ascending order
                ).withConverter<ReplyDetails, DocumentData>({
                    toFirestore: firestoreDefaultConverter.toFirestore,
                    fromFirestore: (snapshot, options) => {
                        const data = firestoreDefaultConverter.fromFirestore(snapshot, options)
                        // usually you can do data validation here
                        if (!data) return {} as ReplyDetails;
                        data.metadata = snapshot.metadata
                        return data as ReplyDetails;
                    },
                });
            } else {
                addToast({
                    message: "Invalid user",
                    type: "error"
                });
                return null;
            }
        }
        return null;
    }, {ssrKey: 'replies'});

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

        //Stop processing if any UI error
        const sendConfession = new SendReply(form);
        if (!sendConfession.checkFormValid()) return;

        loading.send_reply = true;

        const message = form.send_reply;
        form.send_reply = "";

        const {fakecolor, fakename} = getFakeNameAndImage(currentUser.value.uid);

        const formData = {
            cid: route.query.cid,
            from: currentUser.value.uid,
            to: messageData.value?.from, // from becomes to, because the message is being sent to the original sender
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
    
    watch(repliesData, (newPending, oldPending) => {
        setTimeout(()=>scrollTo(scrollHook),1);
    }, { deep: true });

    onBeforeRouteLeave(()=>{
        repliesStop()
        console.log("back pressed")
    })

</script>