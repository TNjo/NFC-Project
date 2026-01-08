"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAnalyticsFn = exports.requestUserAccessFn = exports.verifyUserTokenFn = exports.userLoginFn = exports.verifyAdminTokenFn = exports.adminLoginFn = exports.createAdminFn = exports.trackContactSaveFn = exports.trackPageViewFn = exports.getAnalyticsFn = exports.getUserByUrlFn = exports.generateUserUrlFn = exports.getAllUsersFn = exports.deleteUserFn = exports.updateUserFn = exports.addUserFn = exports.getUserDetailsFn = exports.addUserDetailsFn = void 0;
const admin = __importStar(require("firebase-admin"));
// Only initialize once
if (!admin.apps.length) {
    admin.initializeApp();
}
const functions = __importStar(require("firebase-functions"));
const addUserDetails_1 = require("./handlers/addUserDetails");
const getUserDetails_1 = require("./handlers/getUserDetails");
const addUser_1 = require("./handlers/addUser");
const updateUser_1 = require("./handlers/updateUser");
const deleteUser_1 = require("./handlers/deleteUser");
const getAllUsers_1 = require("./handlers/getAllUsers");
const generateUserUrl_1 = require("./handlers/generateUserUrl");
const getUserByUrl_1 = require("./handlers/getUserByUrl");
const getAnalytics_1 = require("./handlers/getAnalytics");
const trackPageView_1 = require("./handlers/trackPageView");
const trackContactSave_1 = require("./handlers/trackContactSave");
const adminAuth_1 = require("./handlers/adminAuth");
const userAuth_1 = require("./handlers/userAuth");
const getUserAnalytics_1 = require("./handlers/getUserAnalytics");
// User Management Functions
exports.addUserDetailsFn = functions.https.onRequest(addUserDetails_1.addUserDetails);
exports.getUserDetailsFn = functions.https.onRequest(getUserDetails_1.getUserDetails);
exports.addUserFn = functions.https.onRequest(addUser_1.addUser);
exports.updateUserFn = functions.https.onRequest(updateUser_1.updateUser);
exports.deleteUserFn = functions.https.onRequest(deleteUser_1.deleteUser);
exports.getAllUsersFn = functions.https.onRequest(getAllUsers_1.getAllUsers);
exports.generateUserUrlFn = functions.https.onRequest(generateUserUrl_1.generateUserUrl);
exports.getUserByUrlFn = functions.https.onRequest(getUserByUrl_1.getUserByUrl);
exports.getAnalyticsFn = functions.https.onRequest(getAnalytics_1.getAnalytics);
exports.trackPageViewFn = functions.https.onRequest(trackPageView_1.trackPageView);
exports.trackContactSaveFn = functions.https.onRequest(trackContactSave_1.trackContactSave);
// Authentication Functions
exports.createAdminFn = functions.https.onRequest(adminAuth_1.createAdmin);
exports.adminLoginFn = functions.https.onRequest(adminAuth_1.adminLogin);
exports.verifyAdminTokenFn = functions.https.onRequest(adminAuth_1.verifyAdminToken);
// User Authentication Functions
exports.userLoginFn = functions.https.onRequest(userAuth_1.userLogin);
exports.verifyUserTokenFn = functions.https.onRequest(userAuth_1.verifyUserToken);
exports.requestUserAccessFn = functions.https.onRequest(userAuth_1.requestUserAccess);
// User Analytics Functions
exports.getUserAnalyticsFn = functions.https.onRequest(getUserAnalytics_1.getUserAnalytics);
//# sourceMappingURL=index.js.map