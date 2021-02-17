import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<User | null | undefined>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {
    this.user = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.angularFirestore
            .doc<User>(`users/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async userRegister(email: string, name: string, password: string) {
    const credential = await this.angularFireAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    await credential.user?.updateProfile({
      displayName: name,
    });
    return this.updateUserData(credential.user as User);
  }

  async signIn(email: string, password: string) {
    const signInResponse = await this.angularFireAuth.signInWithEmailAndPassword(
      email,
      password
    );
    return signInResponse;
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    this.router.navigate(['/regexTester']);
    return this.updateUserData(credential.user as User);
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    return this.router.navigate(['/login']);
  }

  private updateUserData({ uid, email, displayName }: User) {
    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(
      `users/${uid}`
    );
    const data = {
      uid,
      email,
      displayName,
    };
    return userRef.set(data, { merge: true });
  }
}
