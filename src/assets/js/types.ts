interface AlertData{
  message: string,
  type: 'error' | 'success'| 'warning' | string,
  source: 'ui' | 'server'
  fieldid: string,
};

interface ToastData{
  id?: number,
  message: string,
  isHTML: false | boolean,
  type: 'error' | 'success'| 'warning' | string,
  duration?: number,
};

interface SignupData{
  signup_email: string,
  signup_password: string,
  signup_confirm_password: string,
};

interface LoginData{
  login_email: string,
  login_password: string,
};

interface ForgotPasswordData{
  forgot_email: string,
};

interface ResetPasswordData{
  reset_password: string,
  reset_confirm_password: string,
};

export {
  AlertData,
  ToastData,
  SignupData,
  LoginData,
  ForgotPasswordData,
  ResetPasswordData,
};