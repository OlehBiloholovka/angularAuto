import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // user: Observable<User>;
  //
  // constructor(
  //   private afAuth: AngularFireAuth,
  //   private afs: AngularFirestore,
  //   private router: Router
  // ) {
  //   this.user = this.afAuth.authState.pipe(
  //     switchMap(user => {
  //       // if (!user) return O
  //       if (user) {
  //         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  //       } else {
  //         return of(null);
  //       }
  //     })
  //     // switchMap(user => {
  //     //   if (user) {
  //     //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  //     //   } else {
  //     //     return of(null);
  //     //   }
  //     // })
  //   );
  // }
  // user: User;
  currentUser: Observable<User>;

  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private angularFirestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.user = user;
        this.currentUser = this.angularFirestore.doc<User>(`users/${user.uid}`)
          .valueChanges();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userID', user.uid);
      } else {
        localStorage.setItem('user', null);
        localStorage.removeItem('userID');
      }
    });
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
        .catch(console.log);
    } catch (e) {
      alert('Error!' + e.message);
    }
  }

  // googleLogin() {
  //   const provider = new auth.GoogleAuthProvider();
  //   return this.oAuthLogin(provider);
  // }
  //
  async oAuthLogin(provider) {
    await this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
          .catch(console.log);
      });
    this.router.navigate([''])
      .catch(console.log);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    console.log(user);
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${user.uid}`);

    console.log(userRef);
    const data: User = {
      uid: user.uid,
      phone: user.phoneNumber,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });

  }
  getUserData(userId: string): Observable<User> {
    return this.angularFirestore.doc<User>(`users/${userId}`)
      .valueChanges();
  }
  //
  // signOut() {
  //   this.afAuth.auth.signOut().then(() => {
  //     this.router.navigate(['/']).catch(console.log);
  //   });
  // }

  async logout() {
    await this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login'])
        .catch(console.log);
    });
  }

  async  loginWithGoogle() {
    await this.oAuthLogin(new auth.GoogleAuthProvider());
    // await  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    // this.router.navigate(['/cars']);
  }

  async  loginWithPhone() {
    await this.oAuthLogin(new auth.PhoneAuthProvider());
  }

  async  loginWithFacebook() {
    await  this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
    this.router.navigate(['/cars']);
  }
}
