<template>
  <div class="login flex items-center justify-center h-screen">
    <div class="card shadow max-w-sm m-4">
      <div class="card-body">
          
        <div class="text-4xl font-bold mb-4">Login</div>
        <div class="mb-4">Don't have an account?  <NuxtLink to="/signup" class="text-primary font-bold" replace>Create your account</NuxtLink>, it takes less than a minute</div>

        <form @submit.prevent="loginAccount">
        <div class="form-control">
          <div class="input-group border rounded-lg">
            <span class="bg-transparent">📧</span>
            <input v-model="login_email" type="email" placeholder="Enter your e-mail" class="w-full input">
          </div>  
          <InputLabel labelName="login_email"/>
        </div> 
        
        <div class="form-control">
          <div class="input-group border rounded-lg">
            <span class="bg-transparent">🔒</span>
            <input autocomplete="false" v-model="login_password" type="password" placeholder="Enter password" class="w-full input"> 
          </div>  
          <InputLabel labelName="login_password"/>
        </div> 

        <NuxtLink to="/forgot" class="text-primary font-bold float-right mb-4">Forgot Password?</NuxtLink>
    
        <button type="submit" :class="loading.login ? 
        'btn btn-block glass bg-primary hover:bg-primary loading': 
        'btn btn-block glass bg-primary hover:bg-primary'">
          LOGIN
        </button>
        </form>
      </div>
    </div> 
    

  </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import { AlertData, ToastData, LoginData } from "@/assets/js/types";
  import { changedKeys } from "@/assets/js/functions";
  import { signInWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth";
    
  let loading: { login: boolean } = reactive({ login: false });

  const router = useRouter();

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();

  const { $firebaseAuth } = useNuxtApp();
  const login_email = ref("");
  const login_password = ref("");

  //Create an object with computed values of the fields
  const fieldProps = computed(() => {
    return {
      login_email: login_email.value,
      login_password: login_password.value,
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

  class LoginForm {
    login_email: string;
    login_password: string;
    constructor(props: LoginData){
      this.login_email = props.login_email;
      this.login_password = props.login_password;
    }
    checkRequiredFields(){
      if(this.login_email.length <= 0){
        addFieldAlert({
          message: "Email is required",
          type: "error",
          source: "ui",
          fieldid: "login_email",
        } as AlertData);
      };
      if (this.login_password.length <= 0) {
        addFieldAlert({
          message: "Password is reqired",
          type: "error",
          source: "ui",
          fieldid: "login_password",
        } as AlertData);
      };
    };
    checkFormValid() {
      this.checkRequiredFields();
      return (_.findIndex(fieldAlert.value, {
        source: "ui", 
        type: "error"
      }) > -1) ? false : true;
    };
  };
    
  const loginAccount = () => {

    //Stop processing if any UI error
    const loginForm = new LoginForm(fieldProps.value);
    if(!loginForm.checkFormValid()) return;

    loading.login = true;
    signInWithEmailAndPassword($firebaseAuth, login_email.value, login_password.value)
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