import { ToastData } from "@/assets/js/types";
import _ from "lodash";

export const toasts = () => useState<ToastData[]>("toasts", () => []);
export const toastCounter = () => useState<number>("toastCounter", () => 0);

export const addToast = (toast: ToastData) => {
    toast.id = toastCounter().value++;
    toast.duration ? setTimeout(() => {
        const isOnIndex = (_.findIndex(toasts().value, {id: toast.id}));
        toasts().value.splice(isOnIndex, 1);
    }, toast.duration) : null;
    toasts().value.push(toast);
};

export const getToasts = () => computed(()=>(useState<ToastData[]>("toasts"))).value;