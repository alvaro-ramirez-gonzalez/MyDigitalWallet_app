import { Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc,
  docData, addDoc, updateDoc, deleteDoc, query,
  where, orderBy, QueryConstraint
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  getCollection<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
    const ref = collection(this.firestore, path);
    const q = query(ref, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  getDocument<T>(path: string): Observable<T> {
    const ref = doc(this.firestore, path);
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }

  addDocument<T>(path: string, data: T): Promise<any> {
    const ref = collection(this.firestore, path);
    return addDoc(ref, { ...data as any });
  }

  updateDocument(path: string, data: Partial<any>): Promise<void> {
    const ref = doc(this.firestore, path);
    return updateDoc(ref, data);
  }

  deleteDocument(path: string): Promise<void> {
    const ref = doc(this.firestore, path);
    return deleteDoc(ref);
  }

  
  whereClause(field: string, op: any, value: any) {
    return where(field, op, value);
  }

  orderByClause(field: string, dir: 'asc' | 'desc' = 'asc') {
    return orderBy(field, dir);
  }
}