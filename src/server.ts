import express from 'express';
import * as admin from 'firebase-admin';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protectedRoute';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.FIREBASE_CREDENTIALS) {
  throw new Error('FIREBASE_CREDENTIALS is not defined in .env file');
}

const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_CREDENTIALS);
console.log(`Loading service account from: ${serviceAccountPath}`);

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
