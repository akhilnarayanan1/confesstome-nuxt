<template>
  <div v-if="loading.page || pendingOtherUser"><CircleLoad /></div>
  <div v-else-if="dataOtherUser.length > 0">
    <!-- {{ user }} -->
    <div class="flex items-center justify-center h-screen">
      <div class="card shadow max-w-sm m-4">
        <div class="card-body">
          <!-- <div class="text-4xl font-bold mb-4">What's there for me</div> -->
          <form id="formStartThread" @submit.prevent="startThread">
            
            <div class="mb-4">Spill it out for {{ dataOtherUser.at(0)?.name }}</div>

            <textarea v-model="form.send_confession" placeholder="Bio" class="mb-4 textarea textarea-bordered textarea-lg w-full max-w-xs" ></textarea>
            <InputLabel class="-mt-6" labelName="send_confession" />
            <button type="submit" class="btn btn-block glass bg-apptheme hover:bg-apptheme">
              <span v-if="loading.sendMessage" class="loading loading-spinner loading-sm"></span>
              <span>Send Confession</span>
            </button>
            
          </form>
        </div>
      </div> 
    </div>
  </div>
  <div v-else>
    User Not Found
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
      addToast({
        message: "Unknown error, Please try again (101)",
        type: "error",
        duration: 2000,
      } as ToastData);
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
      addToast({
        message: "Message sent successfully!",
        type: "success",
        duration: 3000,
      });
    };

    form.send_confession = "";
    loading.sendMessage = false;
  };
  
</script>