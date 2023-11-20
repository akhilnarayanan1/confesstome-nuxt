import { type Timestamp } from "firebase-admin/firestore";

interface AlertData{
  message: string,
  type: 'error' | 'success'| 'warning',
  source: 'ui' | 'server'
  fieldid: string,
};

interface ToastData{
  id?: number,
  message: string,
  run?: {
    feature: () => void,
    message: string,
  },
  type: 'error' | 'success'| 'warning',
  duration?: number,
};

interface RandomKeyValue { 
  [key: string]: string;
}

interface FirestoreUserProfile{
  createdOn: Timestamp | string, 
  name: string, 
  username: string
};

export type {
  AlertData,
  ToastData,
  RandomKeyValue,
  FirestoreUserProfile,
};