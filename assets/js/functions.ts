import _ from "lodash";
import { faker } from "@faker-js/faker";
import type { RandomKeyValue, MessageDetails } from "@/assets/js/types";
import type { User } from "firebase/auth";

const changedKeys = (o1: RandomKeyValue, o2: RandomKeyValue) => _.keys(_.pickBy(o1, (v: string, k: string) => v !== o2[k]));

const maskMail = (email: string) => {
  let maskid = email.replace(/^(.)(.*)(.@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c
  );
  return maskid;
};

const getFakeNameAndImage = (userid: string) => {
  let charVal = [];
  for (let i = 0; i < userid.length; i++) {
    charVal.push(userid.charCodeAt(i));
  }
  faker.seed(charVal);
  
  const fakename = faker.person.fullName();
  const fakecolor = faker.color.rgb({format: 'hex', prefix: '#'});

  return {fakename, fakecolor};
};

const getFromAndTo = (messageData: MessageDetails, currentUser: User) => {
  if (messageData.from == currentUser.uid) {
      return {from: currentUser.uid, to: messageData.to}
  } else {
      return {from: currentUser.uid, to: messageData.from}
  }
};

const scrollTo = (view: Ref<HTMLElement | null>) => { 
  view.value?.scrollIntoView({ behavior: 'smooth' }) 
};

export {
  changedKeys,
  maskMail,
  getFakeNameAndImage,
  getFromAndTo,
  scrollTo,
}