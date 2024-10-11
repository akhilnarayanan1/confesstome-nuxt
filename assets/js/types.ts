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

interface MessageDetails {
  docid: string,
  message: string,
  from: string,
  to: string,
  createdOn: Timestamp,
  fakename: string,
  fakecolor: string,
};

interface ReplyDetails {
  id: string
  docid: string,
  cid: string,
  reply: string,
  from: string,
  to: string,
  createdOn: Timestamp,
  fakename: string,
  fakecolor: string,
  metadata: {
    hasPendingWrites: boolean,
    fromCache: boolean,
  }
};

export type {
  AlertData,
  ToastData,
  RandomKeyValue,
  FirestoreUserProfile,
  MessageDetails,
  ReplyDetails,
};