import * as admin from 'firebase-admin';
// Only initialize once
if (!admin.apps.length) {
  admin.initializeApp();
}
import * as functions from 'firebase-functions';
import { addUserDetails } from './handlers/addUserDetails';
import { getUserDetails } from './handlers/getUserDetails';
import { addUser } from './handlers/addUser';
import { updateUser } from './handlers/updateUser';
import { deleteUser } from './handlers/deleteUser';
import { getAllUsers } from './handlers/getAllUsers';
import { generateUserUrl } from './handlers/generateUserUrl';
import { getUserByUrl } from './handlers/getUserByUrl';
import { getAnalytics } from './handlers/getAnalytics';
import { trackPageView } from './handlers/trackPageView';
import { createAdmin, adminLogin, verifyAdminToken } from './handlers/adminAuth';


// User Management Functions
export const addUserDetailsFn = functions.https.onRequest(addUserDetails);
export const getUserDetailsFn = functions.https.onRequest(getUserDetails);
export const addUserFn = functions.https.onRequest(addUser);
export const updateUserFn = functions.https.onRequest(updateUser);
export const deleteUserFn = functions.https.onRequest(deleteUser);
export const getAllUsersFn = functions.https.onRequest(getAllUsers);
export const generateUserUrlFn = functions.https.onRequest(generateUserUrl);
export const getUserByUrlFn = functions.https.onRequest(getUserByUrl);
export const getAnalyticsFn = functions.https.onRequest(getAnalytics);
export const trackPageViewFn = functions.https.onRequest(trackPageView);

// Authentication Functions
export const createAdminFn = functions.https.onRequest(createAdmin);
export const adminLoginFn = functions.https.onRequest(adminLogin);
export const verifyAdminTokenFn = functions.https.onRequest(verifyAdminToken);