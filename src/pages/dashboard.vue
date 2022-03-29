<template>
  <div>

  <input type="checkbox" :checked="completeProfileModal.open" id="my-modal" class="modal-toggle">
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Complete Profile</h3>

      <form @submit.prevent="createAccount">
        <div class="form-control">
          <div class="input-group border rounded-lg">
            <span class="bg-transparent">🤠</span>
            <input v-model="update_name" type="text" placeholder="Enter your name" class="w-full input">
          </div>  
          <InputLabel labelName="update_name"/>
        </div> 
        
        <div class="form-control">
          <div class="input-group border rounded-lg">
            <span class="bg-transparent">🩸</span>
            <input autocomplete="false" v-model="update_username" type="text" placeholder="Choose a username" class="w-full input"> 
          </div>  
          <InputLabel labelName="update_username"/>
        </div> 

        <div class="modal-action">
          <button type="submit" :class="loading.continue ? 
          'btn glass bg-primary hover:bg-primary loading': 
          'btn glass bg-primary hover:bg-primary'">
            CONTINUE
          </button>
        </div>

        
        </form>
      
    </div>
  </div>

  </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import { UpdateData, AlertData, ToastData } from "@/assets/js/types";
  import { changedKeys } from "@/assets/js/functions";
  import { doc, getDoc, setDoc, query, collection, where, orderBy, limit, serverTimestamp } from "firebase/firestore"; 

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();
  
  const { $firebaseDB } = useNuxtApp();
  
  const loading = reactive({ continue: false });
  const completeProfileModal = reactive({ loading:true, open: false });

  const update_name = ref("");
  const update_username = ref("");

  //Create an object with computed values of the fields
  const fieldProps = computed(() => {
    return {
      update_name: update_name.value,
      update_username: update_username.value,
    };
  });

  watch(() => _.cloneDeep(fieldProps.value),
  (newval, preval) => {
    //Find and delete any alerts that are no longer relevant
    const changedKey = changedKeys(newval, preval);
    for (let i=0; i< changedKey.length; i++) {
      const isOnIndex = (_.findIndex(fieldAlert.value, {fieldid: changedKey[i]}));
      if(isOnIndex > -1) fieldAlert.value.splice(isOnIndex, 1);
    };
  });

  class CompleteProfileForm {
    update_name: string;
    update_username: string;
    constructor(props: UpdateData){
      this.update_name = props.update_name;
      this.update_username = props.update_username;
    }
    checkRequiredFields(){
      if(this.update_name.length <= 0){
        addFieldAlert({
          message: "Name is required",
          type: "error",
          source: "ui",
          fieldid: "update_name",
        } as AlertData);
      };
      // if(this.update_name.length <= 2){ // set REGEX
      //   addFieldAlert({
      //     message: "Name should be atleast 3 characters long",
      //     type: "error",
      //     source: "ui",
      //     fieldid: "update_name",
      //   } as AlertData);
      // };
      if (this.update_username.length <= 0) {
        addFieldAlert({
          message: "Username is reqired",
          type: "error",
          source: "ui",
          fieldid: "update_username",
        } as AlertData);
      };
      // if (this.update_username.length <= 0) { // set REGEX
      //   addFieldAlert({
      //     message: "Username is reqired",
      //     type: "error",
      //     source: "ui",
      //     fieldid: "update_username",
      //   } as AlertData);
      // };
    };
    checkFormValid() {
      this.checkRequiredFields();
      return (_.findIndex(fieldAlert.value, {
        source: "ui", 
        type: "error"
      }) > -1) ? false : true;
    };
  };

  const createAccount = async () => {

    //Stop processing if any UI error
    const completeProfileForm = new CompleteProfileForm(fieldProps.value);
    if(!completeProfileForm.checkFormValid()) return;

    loading.continue = true;

    const user = await getUserDataPromised();

    await setDoc(doc($firebaseDB, "users", user.uid), {
      name: update_name.value,
      username: update_username.value,
      createdOn: serverTimestamp(),
    });

    loading.continue = false;

    completeProfileModal.open = false;

    addToast({
      message: "Profile updated successfully!",
      type: "success",
      duration: 2000,
    } as ToastData);

  };





  onMounted(async ()=>{
    const user = await getUserDataPromised();

    const userSnap = await getDoc(doc($firebaseDB, "users", user.uid));
    
    completeProfileModal.loading = false;

    if (!userSnap.exists() || !userSnap.data().name || !userSnap.data().username) {
      console.log("Document data:", userSnap.data());
      completeProfileModal.open = true;
    } 

  });

  // watch(completeProfileModal, () => {
  //   console.log("completeProfileModal", completeProfileModal);
  // }, { deep: true });



</script>