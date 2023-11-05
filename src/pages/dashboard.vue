<template>
  <div>

    
    <button @click="signOutUser" class="btn btn-block glass bg-primary hover:bg-primary">
      Signout
    </button>

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
  import { type AlertData, type ToastData } from "@/assets/js/types";
  import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; 
  import { signOut } from "firebase/auth";
  import { collection, query, where, getDocs } from "firebase/firestore";

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();
  
  const db = useFirestore();
  
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

    const user = firebaseUser().value || await getUserDataPromised()

    const q = query(collection(db, "users"), where("username", "==", form.update_username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      addFieldAlert({
        message: "User already exist. Pick another username.",
        source: "server",
        type: "error",
        fieldid: "update_username",
      })
    } else {
      await setDoc(doc(db, "users", user.uid), {
        name: form.update_name,
        username: form.update_username,
        createdOn: serverTimestamp(),
      });
      completeProfileModal.open = false;
      addToast({
        message: "Profile updated successfully!",
        type: "success",
        duration: 2000,
      } as ToastData);
    }
    loading.continue = false;
  };





  onMounted(async ()=>{
    const user = firebaseUser().value || await getUserDataPromised();
    const userSnap = await getDoc(doc(db, "users", user.uid));
    
    completeProfileModal.loading = false;

    if (!user.isAnonymous && (!userSnap.exists() || !userSnap.data().name || !userSnap.data().username)) {
      console.log("Document data:", userSnap.data());
      completeProfileModal.open = true;
    } 

  });

  // watch(completeProfileModal, () => {
  //   console.log("completeProfileModal", completeProfileModal);
  // }, { deep: true });

  const signOutUser = () => {
    const auth = useFirebaseAuth()!;
    signOut(auth).catch(error => {
      addToast({
        message: error,
        type: "error"
      })
    })
  };



</script>