// src/services/auth.ts
"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error: any) {
    if (
      error?.code === "auth/cancelled-popup-request" ||
      error?.code === "auth/popup-closed-by-user"
    ) {
      // user cancelled or another popup interrupted; treat as "no login"
      return null;
    }
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}