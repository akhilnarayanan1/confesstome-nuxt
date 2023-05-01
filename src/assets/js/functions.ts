import _ from "lodash";

const changedKeys = (o1: {[key: string]: string}, o2: {[key: string]: string}) => _.keys(_.pickBy(o1, (v: string, k: string) => v !== o2[k]));

// const pushFieldAlert = (store:any , alertData: AlertData) => {
//     store.commit('addFieldAlert', alertData)
// }

// const pushToast = (store:any, toastData: ToastData) =>{
//     store.commit('addToast', toastData)
// }

const maskMail = (email: string) => {
  let maskid = email.replace(/^(.)(.*)(.@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c
  );
  return maskid;
};


export {
  changedKeys,
  // pushFieldAlert,
  // pushToast, 
  maskMail,
}