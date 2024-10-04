<template>
    <Navbar />
        <div v-if="loading.page"><LoadingChats /></div>
        <div v-else>
            <div> {{ route.query }} </div>
            <div> {{ confession.message }} </div>
        </div>
</template>

<script setup lang="ts">
    import { useIsCurrentUserLoaded } from 'vuefire';
    import type { ToastData, ReplyDetails, MessageDetails } from "@/assets/js/types";
    import { collection, query, where, getDocs, getDoc, orderBy, doc } from "firebase/firestore";

    const currentUser = useCurrentUser();
    const db = useFirestore();
    const route = useRoute();

    const loading = reactive({ page: true, replies: true })
    const replies = ref([] as ReplyDetails[])
    const confession = ref({} as MessageDetails)

    watchEffect(() => loading.page = currentUser == undefined);

    onMounted(() => {
        if (!useIsCurrentUserLoaded().value) {
            watch(currentUser, (newCurrentUser) => loadReplies());
        } else {
            loadReplies();
        }
    });

    const loadReplies = async () => {
        //Stop processing if user is blank
        if (!currentUser.value) {
            addToast({
                message: "Unknown error, Please try again (401)",
                type: "error",
                duration: 2000,
            } as ToastData);
            return;
        };
        if (!route.query.cid) {
            addToast({
                message: "invalid query parameters",
                type: "error",
                duration: 2000,
            } as ToastData);
            return;
        }

        loading.replies = true;

        const docRef = doc(db, "messages", route.query.cid as string);
        const docSnap = await getDoc(docRef).catch((err) => {
            switch(err.code) {
                case "permission-denied":
                    addToast({
                        message: "Invalid Permission, Something went wrong (401)",
                        type: "error",
                        duration: 2000,
                    } as ToastData);
                    break;
                default:
                    addToast({
                        message: err,
                        type: "error",
                        duration: 2000,
                    } as ToastData);
                    break;
            };
        });

        if (!docSnap || !docSnap.exists()) {
            addToast({
                message: "No message found",
                type: "error",
                duration: 2000,
            } as ToastData)
            return;
        }
        
        confession.value = docSnap.data() as MessageDetails;

        const q = query(
            collection(db, "replies"),
            where("to", "==", currentUser.value.uid as string),
            where("from", "==", route.query.from as string),
            where("cid", "==", route.query.cid as string),
            orderBy("createdOn", "desc") // Order by "createdOn" in descending order
        );

        const querySnapshot = await getDocs(q).catch((err) => {
            switch(err.code) {
                case "permission-denied":
                    addToast({
                        message: "Invalid Permission, Something went wrong (401)",
                        type: "error",
                        duration: 2000,
                    } as ToastData);
                    break;
                default:
                    addToast({
                        message: err,
                        type: "error",
                        duration: 2000,
                    } as ToastData);
                    break;
            };
        });
        loading.replies = false;

        if (!querySnapshot || querySnapshot.empty) {
            addToast({
                message: "No replies found",
                type: "error",
                duration: 2000,
            } as ToastData)
            return; 
        }
        querySnapshot.forEach((doc) => {
            replies.value.push(doc.data() as ReplyDetails);
        });
  };

</script>