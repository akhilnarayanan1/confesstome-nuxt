<template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm w-full m-4">
          
        <div class="text-4xl font-black mb-6 text-center">🎭 Login</div>
        <div class="mb-6 text-center text-white/90">Don't have an account?  <NuxtLink to="/signup" class="font-bold text-yellow-300 hover:text-yellow-200 transition-colors" replace>Create your account</NuxtLink>, it takes less than a minute</div>

        <form id="formLoginAccount" @submit.prevent="loginAccount">
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">📧</span>
              <input v-model="form.login_email" type="email" placeholder="Enter your e-mail" class="grow bg-transparent" />
            </label>
            <InputLabel labelName="login_email"/>
          </div>

          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">🔒</span>
              <input autocomplete="false" v-model="form.login_password" type="password" placeholder="Enter password" class="grow bg-transparent" />
            </label>
            <InputLabel labelName="login_password"/>
          </div>

        <NuxtLink to="/forgot" class="text-yellow-300 hover:text-yellow-200 font-bold float-right mb-4 transition-colors">Forgot Password?</NuxtLink>
    
          <button type="submit" class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50">
            <span v-if="loading.login" class="loading loading-spinner loading-sm"></span>
            <span>🚀 LOGIN</span>
          </button>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import type { ToastData } from "@/assets/js/types";
  import { signInWithEmailAndPassword, sendEmailVerification, type User } from "firebase/auth";
  import { LoginForm } from "@/assets/js/forms";

  definePageMeta({ layout: 'auth' });
    
  let loading: { login: boolean } = reactive({ login: false });

  const router = useRouter();

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts();

  const auth = useFirebaseAuth()!;
  
  //Create a form
  const form = reactive({
    login_email: '',
    login_password: ''
  });

  const loginAccount = () => {

    //Stop processing if any UI error
    const loginForm = new LoginForm(form);
    if(!loginForm.checkFormValid()) return;

    loading.login = true;
    signInWithEmailAndPassword(auth, form.login_email, form.login_password)
    .then((userCredential) => {
      loading.login = false;
      if (userCredential.user.emailVerified) {
        router.replace({name: "dashboard",});
      } else {
        addToast({
          message: `Please verify your email 📧 address before login.`,
          run: { 
            feature: () => sendVerificationEmail(userCredential.user),
            message: "RESEND EMAIL",
          },
          type: "error",
        } as ToastData);
      };
    })
    .catch((err) => {
      loading.login = false
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/user-not-found":
          addToast({
            message: "Wrong credentials. Please check and try again",
            type: "error",
            duration: 2000,
          } as ToastData);
          break;
        case "auth/user-disabled":
          addToast({
            message: "Your account has been disabled. Please contact support",
            type: "error",
          } as ToastData);
          break;
        case "auth/too-many-requests":
          addToast({
            message: "Calm down. You are trying to login too many times",
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
      }
    });
      
  };

  const sendVerificationEmail = (user: User) => {
    sendEmailVerification(user).then(()=>{
      addToast({
        message: "Verification email has been sent. Please check your email",
        type: "success",
        duration: 2000,
      } as ToastData);
    }).catch((err)=>{
      switch (err.code) {
        case "auth/too-many-requests":
          addToast({
            message: "Calm down. You are trying to too many times",
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
      }
    });
  };

</script>