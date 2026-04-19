import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Capacitor } from '@capacitor/core';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<firebase.User | null>(null);
  public currentUser$: Observable<firebase.User | null> = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afAuth.authState.subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  get currentUser(): firebase.User | null {
    return this.currentUserSubject.value;
  }

  async loginWithEmail(email: string, password: string): Promise<firebase.User> {
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    return result.user!;
  }

  async registerWithEmail(email: string, password: string, userData: Partial<UserModel>): Promise<firebase.User> {
    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const user = result.user!;

    await this.afs.doc(`users/${user.uid}`).set({
      ...userData,
      uid: user.uid,
      email: user.email,
      biometricEnabled: false,
      createdAt: new Date()
    });

    return user;
  }

  async loginWithGoogle(): Promise<firebase.User> {
    const isNative = Capacitor.isNativePlatform();
    if (isNative) {
      return this.loginWithGoogleNative();
    } else {
      return this.loginWithGoogleWeb();
    }
  }

  private async loginWithGoogleWeb(): Promise<firebase.User> {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    const result = await this.afAuth.signInWithPopup(provider);
    const user = result.user!;
    await this.syncGoogleUser(user);
    return user;
  }

  private async loginWithGoogleNative(): Promise<firebase.User> {
  
    const response = await GoogleSignIn.signIn();
    
    const idToken = response.idToken;

    if (!idToken) {
      throw new Error('Google Sign-In cancelado o fallido.');
    }

    const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
    const result = await this.afAuth.signInWithCredential(credential);
    const user = result.user!;
    await this.syncGoogleUser(user);
    return user;
  }

  private async syncGoogleUser(user: firebase.User): Promise<void> {
    const doc = await this.afs.doc(`users/${user.uid}`).get().toPromise();
    if (!doc?.exists) {
      await this.afs.doc(`users/${user.uid}`).set({
        uid: user.uid,
        email: user.email,
        nombre: user.displayName?.split(' ')[0] || '',
        apellido: user.displayName?.split(' ')[1] || '',
        biometricEnabled: false,
        createdAt: new Date()
      });
    }
  }

  async logout(): Promise<void> {
    const isNative = Capacitor.isNativePlatform();
    if (isNative) {
      try { 

        await GoogleSignIn.signOut(); 
      } catch (e) {
        console.warn('Error al cerrar sesión en Google nativo', e);
      }
    }
    await this.afAuth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}