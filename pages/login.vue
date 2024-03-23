<template>
  <div class="login flex items-center justify-center h-screen">

    <div class="card shadow max-w-sm m-4">
      <div class="card-body">
          
        <div class="text-4xl font-bold mb-4">Login</div>
        <div class="mb-4">Don't have an account?  <NuxtLink to="/signup" class="text-primary font-bold" replace>Create your account</NuxtLink>, it takes less than a minute</div>

        <form id="formLoginAccount" @submit.prevent="loginAccount">
          <div class="form-control">
            <div class="relative input-group border rounded-lg">
              <div class="absolute mt-3 flex items-center ps-3.5">
                <span class="material-symbols-outlined">mail</span>
              </div>
              <input v-model="form.login_email" type="email" placeholder="Enter your e-mail" class="w-full input ps-12">
            </div>
            <InputLabel labelName="login_email"/>
          </div>

          <div class="form-control">
            <div class="relative input-group border rounded-lg">
              <div class="absolute mt-3 flex items-center ps-3.5">
                <span class="material-symbols-outlined">lock</span>
              </div>
              <input autocomplete="false" v-model="form.login_password" type="password" placeholder="Enter password" class="w-full input ps-12"> 
            </div>
            <InputLabel labelName="login_password"/>
          </div>

        <NuxtLink to="/forgot" class="text-primary font-bold float-right mb-4">Forgot Password?</NuxtLink>
    
          <button type="submit" class="btn btn-block glass bg-primary hover:bg-primary text-white">
            <span v-if="loading.login" class="loading loading-spinner loading-sm"></span>
            <span>LOGIN</span>
          </button>
        </form>
      </div>
    </div> 
    

  </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import type { ToastData } from "@/assets/js/types";
  import { signInWithEmailAndPassword, sendEmailVerification, type User } from "firebase/auth";
  import { LoginForm } from "@/assets/js/forms";
    
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