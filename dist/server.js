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
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const protectedRoute_1 = __importDefault(require("./routes/protectedRoute"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Importar o middleware CORS
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
if (!process.env.FIREBASE_CREDENTIALS) {
    throw new Error('FIREBASE_CREDENTIALS is not defined in .env file');
}
const serviceAccountPath = path_1.default.resolve(process.cwd(), process.env.FIREBASE_CREDENTIALS);
console.log(`Loading service account from: ${serviceAccountPath}`);
try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully');
}
catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
}
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/protected', protectedRoute_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
