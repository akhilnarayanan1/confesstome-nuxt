<template>
  <div v-if="loading.page"><CircleLoad /></div>
  <div v-else class="flex items-center justify-center h-screen">
    <div class="card shadow max-w-sm m-4">
      <div class="card-body">
        <div class="text-4xl font-bold mb-4">Signup</div>
        <div class="mb-4">Already have an account? <NuxtLink to="/login" class="text-primary font-bold" replace>Login here</NuxtLink>, and stay ahead!</div>

        <form id="formCreateAccount" @submit.prevent="createAccount">
          
          <div class="form-control">
            <div class="relative input-group border rounded-lg">
              <div class="absolute mt-3 flex items-center ps-3.5">
                <span class="material-symbols-outlined">email</span>
              </div>
              <input v-model="form.signup_email" type="email" placeholder="Enter your e-mail" class="w-full input ps-12"> 
            </div>
            <InputLabel labelName="signup_email"/>
          </div>
          <div class="form-control">
            <div class="relative input-group border rounded-lg">
              <div class="absolute mt-3 flex items-center ps-3.5">
                <span class="material-symbols-outlined">lock</span>
              </div>
              <input v-model="form.signup_password" type="password" placeholder="Choose a password" class="w-full input ps-12" autocomplete="false"> 
            </div>
            <InputLabel labelName="signup_password"/>
          </div>
          <div class="form-control">
            <div class="relative input-group border rounded-lg">
              <div class="absolute mt-3 flex items-center ps-3.5">
                <span class="material-symbols-outlined">lock</span>
              </div>
              <input v-model="form.signup_confirm_password" type="password" placeholder="Confirm your password" class="w-full input ps-12" autocomplete="false"> 
            </div>
            <InputLabel labelName="signup_confirm_password"/>
          </div>
          <!-- <div class="form-control">
              <div class="label">
                  <input type="checkbox" checked="checked" class="checkbox checkbox-primary">
                  <span class="label-text m-4">I agree to <NuxtLink to="/terms" class="text-primary">Terms of use</NuxtLink> & <NuxtLink to="/privacy" class="text-primary">Privacy Policy</NuxtLink></span> 
              </div>   
          </div> -->

          <button type="submit" class="btn btn-block glass bg-primary hover:bg-primary text-white">
            <span v-if="loading.signup" class="loading loading-spinner loading-sm"></span>
            <span>CREATE ACCOUNT</span>
          </button>
        </form>
        
          <!-- <button class="btn btn-block bg-error hover:bg-error text-white">
            <span v-if="loading.signup" class="loading loading-spinner loading-sm"></span>
            <NuxtImg format="auto" src="/icons8-google.svg" alt="Google Logo" class="w-6 h-6 inline-block"/>
            <span>GOOGLE SIGNUP</span>
          </button> -->
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import type { AlertData, ToastData } from "@/assets/js/types";
  import { linkWithCredential, EmailAuthProvider, sendEmailVerification, type User } from "firebase/auth";
  import { SignupForm } from "@/assets/js/forms";
  
  let loading = reactive({ page: true, signup: false });

  const currentUser = useCurrentUser();
  
  watchEffect(() => loading.page = currentUser.value == undefined);
  
  const router = useRouter();

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts();

  //Create a form
  const form = reactive({
    signup_email: '',
    signup_password: '',
    signup_confirm_password: '',
  });

  const createAccount = async () => {

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
    const signupForm = new SignupForm(form);
    if(!signupForm.checkFormValid()) return;

    loading.signup = true;
    const credential = EmailAuthProvider.credential(form.signup_email, form.signup_password);
    linkWithCredential(currentUser.value as User, credential)
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