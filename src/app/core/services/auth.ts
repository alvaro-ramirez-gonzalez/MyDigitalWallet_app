import { Injectable, NgZone } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithCredential, 
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private zone: NgZone
  ) {
  
    onAuthStateChanged(this.auth, (user) => {
      this.zone.run(() => {
        this.currentUserSubject.next(user);
      });
    });
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  async loginWithEmail(email: string, password: string) {
    return this.zone.run(async () => {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    });
  }

  async registerWithEmail(email: string, password: string, userData: any) {
    return this.zone.run(async () => {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.createUserIfNotExists(result.user, userData);
      return result.user;
    });
  }

  async loginWithGoogle() {
    return Capacitor.isNativePlatform()
      ? this.loginWithGoogleNative()
      : this.loginWithGoogleWeb();
  }

  private async loginWithGoogleWeb() {
    const provider = new GoogleAuthProvider();
    return this.zone.run(async () => {
      try {
        const result = await signInWithPopup(this.auth, provider);
        if (result.user) {
          await this.createUserIfNotExists(result.user);
          return result.user;
        }
        throw new Error('No user found');
      } catch (err) {
        console.error("Web Google Auth Error:", err);
        throw err;
      }
    });
  }

  private async loginWithGoogleNative() {
    await GoogleSignIn.initialize({
      clientId: '574202598990-a324nd7a8v2ikolu16e35oohgqvh2114.apps.googleusercontent.com',
    });

    const response = await GoogleSignIn.signIn();
    if (!response.idToken) throw new Error('No ID Token');

    const credential = GoogleAuthProvider.credential(response.idToken);

    return this.zone.run(async () => {
      try {
        const result = await signInWithCredential(this.auth, credential);
        if (result.user) {
          await this.createUserIfNotExists(result.user);
          return result.user;
        }
        throw new Error('Login failed');
      } catch (err) {
        console.error("Native Google Auth Error:", err);
        throw err;
      }
    });
  }

  private async createUserIfNotExists(user: User, extraData: any = {}) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName?.split(' ')[0] || '',
        apellido: user.displayName?.split(' ')[1] || '',
        biometricEnabled: false,
        createdAt: new Date(),
        ...extraData
      });
    }
  }

  async logout() {
    return this.zone.run(async () => {
      if (Capacitor.isNativePlatform()) {
        try { await GoogleSignIn.signOut(); } catch {}
      }
      await this.auth.signOut();
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}