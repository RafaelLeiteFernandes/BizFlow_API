import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { body, validationResult } from 'express-validator';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);

export const register = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      res.status(201).send(userRecord);
    } catch (error) {
      res.status(400).send(error);
    }
  }
];

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const auth = getAuth(firebaseApp);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
};
