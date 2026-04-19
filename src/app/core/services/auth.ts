import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  async loginWithGoogle(idToken: string): Promise<firebase.User> {
    const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
    const result = await this.afAuth.signInWithCredential(credential);
    const user = result.user!;

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

    return user;
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}