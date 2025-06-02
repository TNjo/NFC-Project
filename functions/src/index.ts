import * as admin from 'firebase-admin';
// Only initialize once
if (!admin.apps.length) {
  admin.initializeApp();
}
import * as functions from 'firebase-functions';
import { addUserDetails } from './handlers/addUserDetails';
import { getUserDetails } from './handlers/getUserDetails';


export const addUserDetailsFn = functions.https.onRequest(addUserDetails);
export const getUserDetailsFn = functions.https.onRequest(getUserDetails);