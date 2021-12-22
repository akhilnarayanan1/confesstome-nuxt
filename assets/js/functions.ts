import _ from 'lodash'
import { AlertData, ToastData } from '@/assets/js/types'

const changedKeys = (o1: any, o2: any) => _.keys(_.pickBy(o1, (v: any, k: any) => v !== o2[k]))

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
}


export {
    changedKeys,
    // pushFieldAlert,
    // pushToast, 
    maskMail
}