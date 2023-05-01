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
  import { AlertData, ToastData } from "@/assets/js/types";
  import { linkWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
  
  let loading = reactive({ signup: false });

  const router = useRouter();
  const user = getUserData();

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();

  //Create a form
  const form = reactive({
    signup_email: '',
    signup_password: '',
    signup_confirm_password: ''
  });

  //Watch and clear any pending alert on field while typing on to the field
  watchAlert(form);

  class SignupForm {
    checkRequiredFields() {
      if(form.signup_password.length < 6){
        addFieldAlert({
          message: "Password must be at least 6 characters",
          type: "error",
          source: "ui",
          fieldid: "signup_password",
        } as AlertData);
      };
      if(form.signup_confirm_password.length < 6){
        addFieldAlert({
          message: "Password must be at least 6 characters",
          fieldid: "signup_confirm_password",
          source: "ui",
          type: "error",
        } as AlertData);
      };
      if(form.signup_email.length <= 0){
        addFieldAlert({
          message: "Email is required",
          fieldid: "signup_email",
          source: "ui",
          type: "error",
        } as AlertData);
      };
    };

    passwordMatcher() {
      if ((form.signup_password.length >= 6) && 
      (form.signup_password === form.signup_confirm_password)) {
        addFieldAlert({
          message: "Password matched",
          fieldid: "signup_confirm_password",
          source: "ui",
          type: "success",
        } as AlertData);
      } else if ((form.signup_password.length >= 6) && 
      (form.signup_password !== form.signup_confirm_password)) {
        addFieldAlert({
            message: "Passwords do not match",
            fieldid: "signup_confirm_password",
            source: "ui",
            type: "error",
        } as AlertData);
      };
    };
    checkFormValid() {
      this.checkRequiredFields()
      this.passwordMatcher()
      return (_.findIndex(fieldAlert.value, {
          source: "ui", 
          type: "error",
      }) > -1) ? false : true;
    };
  };

  const createAccount = () => {

    //Stop processing if user is blank
    if(!user.value){
      addToast({
        message: "Unknown error, Please try again (101)",
        type: "error",
        duration: 2000,
      } as ToastData);
      return;
    };

    //Stop processing if any UI error
    const signupForm = new SignupForm();
    if(!signupForm.checkFormValid()) return;

    loading.signup = true;
    const credential = EmailAuthProvider.credential(form.signup_email, form.signup_password);
    linkWithCredential(user.value, credential)
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