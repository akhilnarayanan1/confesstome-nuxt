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
  import { type ToastData } from "@/assets/js/types";
  import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; 
  import { signOut } from "firebase/auth";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { CompleteProfileForm } from "@/assets/js/forms";

  //Set and clear field alert on page load
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

  const createAccount = async () => {

    const currentUser = firebaseUser().value || await getUserDataPromised();

    //Stop processing if user is blank
    if(!currentUser){
      addToast({
        message: "Unknown error, Please try again (101)",
        type: "error",
        duration: 2000,
      } as ToastData);
      return;
    };

    //Stop processing if any UI error
    const completeProfileForm = new CompleteProfileForm(form);
    if(!completeProfileForm.checkFormValid()) return;

    loading.continue = true;

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
      await setDoc(doc(db, "users", currentUser.uid), {
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
    const currentUser = firebaseUser().value || await getUserDataPromised();
    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    
    completeProfileModal.loading = false;

    if (!currentUser.isAnonymous && (!userSnap.exists() || !userSnap.data().name || !userSnap.data().username)) {
      console.log("Document data:", userSnap.data());
      completeProfileModal.open = true;
    } 

  });

  // watch(completeProfileModal, () => {
  //   console.log("completeProfileModal", completeProfileModal);
  // }, { deep: true });

  const signOutUser = async () => {
    const auth = useFirebaseAuth()!;
    const user = firebaseUser().value || await getUserDataPromised();
    if (!user.isAnonymous) {
      signOut(auth).catch(error => {
        addToast({
          message: error,
          type: "error"
        })
      })
    } else {
      addToast({
        message: "Already signedout. Can't signout again.",
        type: "error",
        duration: 3000
      })
    }
    
  };



</script>