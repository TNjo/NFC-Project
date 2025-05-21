import * as functions from 'firebase-functions';
import { addUser } from './handlers/addUser';
import { getUser } from './handlers/getUser';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const addUserFn = functions.https.onRequest(addUser);
export const getUserFn = functions.https.onRequest(getUser);