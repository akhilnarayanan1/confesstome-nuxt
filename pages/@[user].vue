<template>
  <div v-if="otherUser.loading"><LoadingPage /></div>
  <div v-else-if="otherUser.found">
    <!-- {{ user }} -->
    <div class="flex items-center justify-center h-screen">
      <div class="card shadow max-w-sm m-4">
        <div class="card-body">
          <!-- <div class="text-4xl font-bold mb-4">What's there for me</div> -->
          <form id="formStartThread" @submit.prevent="startThread">
            
            <div class="mb-4">Spill it out for {{ otherUser.name }}</div>

            <textarea v-model="form.send_confession" placeholder="Bio" class="mb-4 textarea textarea-bordered textarea-lg w-full max-w-xs" ></textarea>
            <InputLabel class="-mt-6" labelName="send_confession" />
            <button type="submit" class="btn btn-block glass bg-primary hover:bg-primary text-white">
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

  <!-- <div>{{ $route.params.user }}</div> -->
</template>

<script setup lang="ts">
  import type { ToastData } from "@/assets/js/types";
  import { collection, query, where, getDocs, getDoc, serverTimestamp, addDoc } from "firebase/firestore";
  import { SendConfession } from "@/assets/js/forms";
  import { useIsCurrentUserLoaded } from "vuefire";
  import { faker } from "@faker-js/faker";

  const db = useFirestore()!;
  const route = useRoute();

  const loading = reactive({ page: true, sendMessage: false});

  const currentUser = useCurrentUser();

  watchEffect(() => loading.page = currentUser.value == undefined);

  const form = reactive({ send_confession: ''});

  const otherUser = reactive({ loading: true, found: false, name: "", username: "", uid: "" });

  const getFakeNameAndImage = async () => {
    const apiUrl = 'https://api.color.pizza';
    const fakecolor = faker.color.rgb({format: 'hex', prefix: ''});
    const { data: color } = await useFetch(apiUrl + '/v1/'+ fakecolor + '?values=&list=bestOf');

    const approxColor = (toRaw(color.value) as { colors: { name: string }[] }).colors[0].name;
    const approxImage = (toRaw(color.value) as { colors: { swatchImg: {svg: string} }[] }).colors[0].swatchImg.svg;
    
    const fakename = approxColor;
    const fakeimage = apiUrl + approxImage;

    return {fakename, fakeimage};
  };

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

    if (otherUser.uid === currentUser.value?.uid) {
      addToast({
        message: "You can't send message to yourself.",
        type: "error",
        duration: 3000,
      })
      loading.sendMessage = false;
      return;
    };

    const {fakename, fakeimage} = await getFakeNameAndImage();

    await addDoc((collection(db, "messages")), {
      to: otherUser.uid,
      from: currentUser.value?.uid as string,
      message: form.send_confession,
      createdOn: serverTimestamp(),
      fakename: fakename,
      fakeimage: fakeimage,
    });

    addToast({
      message: "Message sent successfully!",
      type: "success",
      duration: 3000,
    });
    form.send_confession = "";
    loading.sendMessage = false;
  };

  onMounted(async ()=> {
    if (!useIsCurrentUserLoaded().value) {
      watch(() => currentUser.value, (newCurrentUser) => loadOtherAccount());
    } else {
      loadOtherAccount();
    }
  });

  const loadOtherAccount = async () => {

    // Suppress Permission error
    if(currentUser.value == undefined) {
      return;
    };

    const q = query(collection(db, "users"), where("username", "==", route.params.user));
    const querySnapshot = await getDocs(q);

    otherUser.loading = false;
    querySnapshot.empty ? otherUser.found = false : otherUser.found = true;

    if (!querySnapshot.empty) {
      const id = querySnapshot.docs[0].id;
      const { name, username } =  querySnapshot.docs[0].data();
      otherUser.name = name;
      otherUser.username = username;
      otherUser.uid = id;
    }
  };
  
</script>