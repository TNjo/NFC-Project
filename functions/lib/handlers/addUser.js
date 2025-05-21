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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true }); // Allow all origins (you can customize this)
const addUser = (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { firstName, lastName, dob, phoneNumber, address, theme, profileImageUrl } = req.body;
            // Validate required fields
            if (!firstName || !lastName || !dob || !phoneNumber || !address || !theme) {
                res.status(400).json({ error: "Missing fields" });
                return;
            }
            const docRef = await admin.firestore().collection("users").add({
                firstName,
                lastName,
                dob,
                phoneNumber,
                address,
                theme,
                profileImageUrl: profileImageUrl || null,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            // Return new document ID
            res.status(200).json({ userId: docRef.id });
        }
        catch (err) {
            console.error("addUser error:", err);
            res.status(500).json({ error: "Server error" });
        }
    });
};
exports.addUser = addUser;
//# sourceMappingURL=addUser.js.map