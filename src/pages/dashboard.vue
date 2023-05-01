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
            <input v-model="form.update_name" type="text" placeholder="Enter your name" class="w-full input">
          </div>  
          <InputLabel labelName="update_name"/>
        </div> 
        
        <div class="form-control">
          <div class="input-group border rounded-lg">
            <span class="bg-transparent">🩸</span>
            <input autocomplete="false" v-model="form.update_username" type="text" placeholder="Choose a username" class="w-full input"> 
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
  import { AlertData, ToastData } from "@/assets/js/types";
  import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; 

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();
  
  const { $firebaseDB } = useNuxtApp();
  
  const loading = reactive({ continue: false });
  const completeProfileModal = reactive({ loading:true, open: false });

  //Create a form
  const form = reactive({
    update_name: '',
    update_username: ''
  });

  //Watch and clear any pending alert on field while typing on to the field
  watchAlert(form);

  class CompleteProfileForm {
    checkRequiredFields(){
      if(form.update_name.length <= 0){
        addFieldAlert({
          message: "Name is required",
          type: "error",
          source: "ui",
          fieldid: "update_name",
        } as AlertData);
      };
      // if(form.update_name.length <= 2){ // set REGEX
      //   addFieldAlert({
      //     message: "Name should be atleast 3 characters long",
      //     type: "error",
      //     source: "ui",
      //     fieldid: "update_name",
      //   } as AlertData);
      // };
      if (form.update_username.length <= 0) {
        addFieldAlert({
          message: "Username is reqired",
          type: "error",
          source: "ui",
          fieldid: "update_username",
        } as AlertData);
      };
      // if (form.update_username.length <= 0) { // set REGEX
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
    const completeProfileForm = new CompleteProfileForm();
    if(!completeProfileForm.checkFormValid()) return;

    loading.continue = true;

    const user = await getUserDataPromised();

    await setDoc(doc($firebaseDB, "users", user.uid), {
      name: form.update_name,
      username: form.update_username,
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