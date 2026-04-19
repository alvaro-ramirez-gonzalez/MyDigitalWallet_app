import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore';
import { AuthService } from './auth';
import { UserModel } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  getCurrentUserProfile(): Observable<UserModel | null> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        return this.firestoreService.getDocument<UserModel>(`users/${user.uid}`);
      })
    );
  }

  getUserProfile(uid: string): Observable<UserModel> {
    return this.firestoreService.getDocument<UserModel>(`users/${uid}`);
  }

  updateProfile(uid: string, data: Partial<UserModel>): Promise<void> {
    return this.firestoreService.updateDocument(`users/${uid}`, data);
  }

  updateFcmToken(uid: string, fcmToken: string): Promise<void> {
    return this.firestoreService.updateDocument(`users/${uid}`, { fcmToken });
  }

  updateBiometricStatus(uid: string, enabled: boolean): Promise<void> {
    return this.firestoreService.updateDocument(`users/${uid}`, { biometricEnabled: enabled });
  }
}