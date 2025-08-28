<template>
  <div v-if="loading.page"><CircleLoad /></div>
  <div v-else class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <div class="flex items-center justify-center min-h-screen relative z-10">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm w-full m-4">
        <div class="text-4xl font-black mb-6 text-center">🚀 Signup</div>
        <div class="mb-6 text-center text-white/90">Already have an account? <NuxtLink to="/login" class="text-yellow-300 hover:text-yellow-200 font-bold transition-colors" replace>Login here</NuxtLink>, and stay ahead!</div>

        <form id="formCreateAccount" @submit.prevent="createAccount">
          
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">📧</span>
              <input v-model="form.signup_email" type="email" placeholder="Enter your e-mail" class="grow bg-transparent" />
            </label>
            <InputLabel labelName="signup_email"/>
          </div>
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">🔒</span>
              <input v-model="form.signup_password" type="password" placeholder="Choose a password" class="grow bg-transparent" autocomplete="false" />
            </label>
            <InputLabel labelName="signup_password"/>
          </div>
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">🔒</span>
              <input v-model="form.signup_confirm_password" type="password" placeholder="Confirm your password" class="grow bg-transparent" autocomplete="false" />
            </label>
            <InputLabel labelName="signup_confirm_password"/>
          </div>
          <!-- <div class="form-control">
              <div class="label">
                  <input type="checkbox" checked="checked" class="checkbox checkbox-primary">
                  <span class="label-text m-4">I agree to <NuxtLink to="/terms" class="text-primary">Terms of use</NuxtLink> & <NuxtLink to="/privacy" class="text-primary">Privacy Policy</NuxtLink></span> 
              </div>   
          </div> -->

          <button type="submit" class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50">
            <span v-if="loading.signup" class="loading loading-spinner loading-sm"></span>
            <span>✨ CREATE ACCOUNT</span>
          </button>
        </form>
        
          <!-- <button class="btn btn-block bg-error hover:bg-error">
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