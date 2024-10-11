import _ from "lodash";
import { faker } from "@faker-js/faker";
import { type RandomKeyValue } from "@/assets/js/types";

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

export {
  changedKeys,
  maskMail,
  getFakeNameAndImage,
}