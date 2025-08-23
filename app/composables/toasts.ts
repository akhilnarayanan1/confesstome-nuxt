import { type ToastData } from "@/assets/js/types";
import _ from "lodash";

export const toasts = () => useState<ToastData[]>("toasts", () => []);

export const addToast = (toast: ToastData) => {
    toast.id = (toasts().value.length + 1); // auto populate IDs
    // set timeout for toast duration parameter if found
    if (toast.duration) {
        setTimeout(() => {
            const isOnIndex = (_.findIndex(toasts().value, {id: toast.id}));
            toasts().value.splice(isOnIndex, 1);
        }, toast.duration)
    };
    // load everthing to state
    toasts().value.push(toast);
}

export const getToasts = () => computed(()=>toasts()).value;

export const clearToasts = () => toasts().value.length = 0;