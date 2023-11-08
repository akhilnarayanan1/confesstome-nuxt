<template>
  <div class="flex items-center justify-center h-screen">
    <div class="card shadow max-w-sm m-4">
      <div class="card-body">
        <div class="text-4xl font-bold mb-4">Signup</div>
        <div class="mb-4">Already have an account? <NuxtLink to="/login" class="text-primary font-bold" replace>Login here</NuxtLink>, and stay ahead!</div>

        <form @submit.prevent="createAccount">
          
          <div class="form-control">
            <div class="input-group border rounded-lg">
              <span class="bg-transparent">📧</span>
              <input v-model="form.signup_email" type="email" placeholder="Enter your e-mail" class="w-full input"> 
            </div>  
            <InputLabel labelName="signup_email"></InputLabel>
          </div> 
          
          <div class="form-control">
            <div class="input-group border rounded-lg">
              <span class="bg-transparent">🔒</span>
              <input v-model="form.signup_password" type="password" placeholder="Choose a password" class="w-full input" autocomplete="false"> 
            </div>  
            <InputLabel labelName="signup_password"/>
          </div> 
          <div class="form-control">
            <div class="input-group border rounded-lg">
              <span class="bg-transparent">🔒</span>
              <input v-model="form.signup_confirm_password" type="password" placeholder="Confirm your password" class="w-full input" autocomplete="false"> 
            </div>  
            <InputLabel labelName="signup_confirm_password"/>
          </div> 
          <!-- <div class="form-control">
              <div class="label">
                  <input type="checkbox" checked="checked" class="checkbox checkbox-primary">
                  <span class="label-text m-4">I agree to <NuxtLink to="/terms" class="text-primary">Terms of use</NuxtLink> & <NuxtLink to="/privacy" class="text-primary">Privacy Policy</NuxtLink></span> 
              </div>   
          </div> -->

          <button type="submit" :class="loading.signup ? 
          'btn btn-block glass bg-primary hover:bg-primary loading': 
          'btn btn-block glass bg-primary hover:bg-primary'">
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import { type AlertData, type ToastData } from "@/assets/js/types";
  import { linkWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
  import { SignupForm } from "@/assets/js/forms";
  
  let loading = reactive({ signup: false });

  const router = useRouter();

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts();

  //Create a form
  const form = reactive({
    signup_email: '',
    signup_password: '',
    signup_confirm_password: ''
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
    const signupForm = new SignupForm(form);
    if(!signupForm.checkFormValid()) return;

    loading.signup = true;
    const credential = EmailAuthProvider.credential(form.signup_email, form.signup_password);
    linkWithCredential(currentUser, credential)
    .then(async (userCredential) => {
      try{
        //Send verification email
        await sendEmailVerification(userCredential.user)
        addToast({
          message: "Account created successfully. Please verify your email 📧 & login to continue.",
          type: "success",
        } as ToastData);
        router.replace({name: "login",});
      } catch (error) {
        addToast({
          message: "Error sending verification email. Try login.",
          type: "error",
        } as ToastData);
      };
      loading.signup = false;
    })
    .catch(err => {
      loading.signup = false;
      switch (err.code) {
        case "auth/invalid-email":
          addFieldAlert({
            message: "Please provide a valid email",
            fieldid: "signup_email",
            source: "server",
            type: "error",
          } as AlertData);
          break;
        case "auth/email-already-in-use":
          addFieldAlert({
            message: "This account is already in use. Please Login",
            fieldid: "signup_email",
            source: "server",
            type: "error",
          } as AlertData);
          break;
        case "auth/provider-already-linked":
          addFieldAlert({
            message: "This account is already in use. Please Login",
            fieldid: "signup_email",
            source: "server",
            type: "error",
          } as AlertData);
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
  };
</script>