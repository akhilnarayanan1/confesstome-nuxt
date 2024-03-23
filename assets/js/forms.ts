import { type AlertData, type RandomKeyValue} from "@/assets/js/types";
import _ from "lodash";

interface TSignupForm {
  signup_email: string;
  signup_password: string;
  signup_confirm_password: string;
}

class SignupForm {
  form: TSignupForm | RandomKeyValue;
  constructor (form: TSignupForm | RandomKeyValue) {
      this.form = form;
      watchAlert(this.form as RandomKeyValue);
  }
  checkRequiredFields() {
    if(this.form.signup_password.length < 6){
      addFieldAlert({
        message: "Password must be at least 6 characters",
        type: "error",
        source: "ui",
        fieldid: "signup_password",
      } as AlertData);
    };
    if(this.form.signup_confirm_password.length < 6){
      addFieldAlert({
        message: "Password must be at least 6 characters",
        fieldid: "signup_confirm_password",
        source: "ui",
        type: "error",
      } as AlertData);
    };
    if(this.form.signup_email.length <= 0){
      addFieldAlert({
        message: "Email is required",
        fieldid: "signup_email",
        source: "ui",
        type: "error",
      } as AlertData);
    };
  };

  passwordMatcher() {
    if ((this.form.signup_password.length >= 6) && 
    (this.form.signup_password === this.form.signup_confirm_password)) {
      addFieldAlert({
        message: "Password matched",
        fieldid: "signup_confirm_password",
        source: "ui",
        type: "success",
      } as AlertData);
    } else if ((this.form.signup_password.length >= 6) && 
    (this.form.signup_password !== this.form.signup_confirm_password)) {
      addFieldAlert({
          message: "Passwords do not match",
          fieldid: "signup_confirm_password",
          source: "ui",
          type: "error",
      } as AlertData);
    };
  };
  checkFormValid() {
    let fieldAlert = getFieldAlerts();
    this.checkRequiredFields()
    this.passwordMatcher()
    return (_.findIndex(fieldAlert.value, {
        source: "ui", 
        type: "error",
    }) > -1) ? false : true;
  };
};



interface TLoginForm {
  login_email: string;
  login_password: string;
}
class LoginForm {
  form: TLoginForm | RandomKeyValue;
  constructor (form: TLoginForm | RandomKeyValue) {
      this.form = form;
      watchAlert(this.form as RandomKeyValue);
  }
  checkRequiredFields(){
    if(this.form.login_email.length <= 0){
      addFieldAlert({
        message: "Email is required",
        type: "error",
        source: "ui",
        fieldid: "login_email",
      } as AlertData);
    };
    if (this.form.login_password.length <= 0) {
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
    let fieldAlert = getFieldAlerts();
    return (_.findIndex(fieldAlert.value, {
      source: "ui", 
      type: "error"
    }) > -1) ? false : true;
  };
};


interface TForgotPasswordForm {
  forgot_email: string;
}
class ForgotPasswordForm {
  form: TForgotPasswordForm | RandomKeyValue;
  constructor (form: TForgotPasswordForm | RandomKeyValue) {
      this.form = form;
      watchAlert(this.form as RandomKeyValue);
  }
  checkRequiredFields(){
    if (this.form.forgot_email.length <= 0) {
      addFieldAlert({
        message: "Email is required",
        type: "error",
        source: "ui",
        fieldid: "forgot_email",
      } as AlertData);
    };
  };
  checkFormValid(){
    this.checkRequiredFields();
    let fieldAlert = getFieldAlerts();
    return (_.findIndex(fieldAlert.value, {
      source: "ui", 
      type: "error",
    }) > -1) ? false : true;
  };
};


interface TResetPasswordForm {
  reset_password: string;
  reset_confirm_password: string;
}
class ResetPasswordForm {
  form: TResetPasswordForm | RandomKeyValue;
  constructor (form: TResetPasswordForm | RandomKeyValue) {
      this.form = form;
      watchAlert(this.form as RandomKeyValue);
  }
  checkRequiredFields() {
    if (this.form.reset_password.length < 6) {
      addFieldAlert({
          message: "Password must be at least 6 characters",
          type: "error",
          source: "ui",
          fieldid: "reset_password",
      } as AlertData);
    };
    if (this.form.reset_confirm_password.length < 6) {
      addFieldAlert({
          message: "Password must be at least 6 characters",
          fieldid: "reset_confirm_password",
          source: "ui",
          type: "error",
      } as AlertData);
    };
  };

  passwordMatcher() {
    if ((this.form.reset_password.length >= 6) && 
    (this.form.reset_password === this.form.reset_confirm_password)) {
      addFieldAlert({
        message: "Password matched",
        fieldid: "reset_confirm_password",
        source: "ui",
        type: "success",
      } as AlertData);
    }else if ((this.form.reset_password.length >= 6) && 
    (this.form.reset_password !== this.form.reset_confirm_password)) {
      addFieldAlert({
        message: "Passwords do not match",
        fieldid: "reset_confirm_password",
        source: "ui",
        type: "error",
      } as AlertData);
    };
  };

  checkFormValid(){
    this.checkRequiredFields()
    this.passwordMatcher()
    let fieldAlert = getFieldAlerts();
    return (_.findIndex(fieldAlert.value, {
      source: "ui", 
      type: "error",
    }) > -1) ? false : true
  };
};



interface TCompleteProfileForm {
  update_name: string;
  update_username: string;
}
class CompleteProfileForm {
  form: TCompleteProfileForm | RandomKeyValue;
  constructor (form: TCompleteProfileForm | RandomKeyValue) {
      this.form = form;
      watchAlert(this.form as RandomKeyValue);
  }
  checkRequiredFields(){
    if(this.form.update_name.length <= 0){
      addFieldAlert({
        message: "Name is required",
        type: "error",
        source: "ui",
        fieldid: "update_name",
      } as AlertData);
    };
    // if(this.form.update_name.length <= 2){ // set REGEX
    //   addFieldAlert({
    //     message: "Name should be atleast 3 characters long",
    //     type: "error",
    //     source: "ui",
    //     fieldid: "update_name",
    //   } as AlertData);
    // };
    if (this.form.update_username.length <= 0) {
      addFieldAlert({
        message: "Username is reqired",
        type: "error",
        source: "ui",
        fieldid: "update_username",
      } as AlertData);
    };
    // if (this.form.update_username.length <= 0) { // set REGEX
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
    let fieldAlert = getFieldAlerts();
    return (_.findIndex(fieldAlert.value, {
      source: "ui", 
      type: "error"
    }) > -1) ? false : true;
  };
};


interface TSendConfession {
  send_confession: string; 
}
class SendConfession {
  form: TSendConfession | RandomKeyValue;
  constructor (form: TSendConfession | RandomKeyValue) {
    this.form = form;
    watchAlert(this.form as RandomKeyValue);
  }
  checkRequiredFields() {
    if(this.form.send_confession.length <= 0){
      addFieldAlert({
        message: "Write something...",
        type: "error",
        source: "ui",
        fieldid: "send_confession",
      } as AlertData);
    };
  };
  checkFormValid() {
    this.checkRequiredFields();
    let fieldAlert = getFieldAlerts();
    return (_.findIndex(fieldAlert.value, {
      source: "ui", 
      type: "error"
    }) > -1) ? false : true;
  };
};
 

export {
  SignupForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  CompleteProfileForm,
  SendConfession,
}