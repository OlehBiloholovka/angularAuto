import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {User} from './user.model';
import {User as FirebaseUser} from 'firebase';
import * as firebase from 'firebase/app';
import ApplicationVerifier = firebase.auth.ApplicationVerifier;
import ConfirmationResult = firebase.auth.ConfirmationResult;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseUser: FirebaseUser;
  currentUser: Observable<User>;

  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private angularFirestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.firebaseUser = user;
        this.currentUser = this.angularFirestore.doc<User>(`users/${user.uid}`)
          .valueChanges();
        this.setUserData(user)
          .catch(AuthService.handleError);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userID', user.uid);
      } else {
        localStorage.setItem('user', null);
        localStorage.removeItem('userID');
      }
    });
  }

  private static handleError(error: any) {
    console.log(error);
  }

  public get isSignOut(): boolean {
    // return localStorage.getItem('user') === null;
    return  this.getUserId === null;
  }

  public get getUserId(): string {
    return localStorage.getItem('userID');
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/cars'])
        .catch(AuthService.handleError);
    } catch (e) {
      alert('Error!' + e.message);
    }
  }
  async oAuthLogin(provider) {
    await this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.setUserData(credential.user)
          .catch(AuthService.handleError);
      });
    this.router.navigate([''])
      .catch(AuthService.handleError);
  }

  private async setUserData(user: FirebaseUser) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      creationTime: user.metadata.creationTime
    };
    return await userRef.set(data, { merge: true });
  }

  async updateUserData(user: User) {
    if (this.firebaseUser) {
      if (user.displayName !== this.firebaseUser.displayName) {
        await this.firebaseUser
          .updateProfile({displayName: user.displayName})
          .catch(AuthService.handleError);
      }
      await this.firebaseUser
        .updatePassword(user.password)
        .catch(AuthService.handleError);
      await this.setUserData(this.firebaseUser)
        .catch(AuthService.handleError);
    }
  }

  getUserData(userId: string): Observable<User> {
    return this.angularFirestore.doc<User>(`users/${userId}`)
      .valueChanges();
  }

  async logout() {
    await this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login'])
        .catch(AuthService.handleError);
    });
  }

  async  loginWithGoogle() {
    await this.oAuthLogin(new auth.GoogleAuthProvider());
  }

  async  loginWithPhone() {
    await this.oAuthLogin(new auth.PhoneAuthProvider());
  }

  async  loginWithFacebook() {
    await  this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
    this.router.navigate(['/cars']);
  }

  async updatePhone(verificationId: string, verificationCode: string) {
    const phoneCredential = firebase.auth.PhoneAuthProvider
      .credential(verificationId, verificationCode);
    return  await this.afAuth.auth.currentUser
      .updatePhoneNumber(phoneCredential);
  }
  async signInWithPhoneNumber(phoneNumber: string, applicationVerifier: ApplicationVerifier): Promise<ConfirmationResult> {
    return await this.afAuth.auth
      .signInWithPhoneNumber(phoneNumber, applicationVerifier);
  }
}
