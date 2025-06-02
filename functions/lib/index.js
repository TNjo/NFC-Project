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
exports.getUserDetailsFn = exports.addUserDetailsFn = void 0;
const admin = __importStar(require("firebase-admin"));
// Only initialize once
if (!admin.apps.length) {
    admin.initializeApp();
}
const functions = __importStar(require("firebase-functions"));
const addUserDetails_1 = require("./handlers/addUserDetails");
const getUserDetails_1 = require("./handlers/getUserDetails");
exports.addUserDetailsFn = functions.https.onRequest(addUserDetails_1.addUserDetails);
exports.getUserDetailsFn = functions.https.onRequest(getUserDetails_1.getUserDetails);
//# sourceMappingURL=index.js.map