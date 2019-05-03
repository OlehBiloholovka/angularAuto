import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  u: Observable<User>;

  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.u = afAuth.authState;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('userID', this.user.uid);
      } else {
        localStorage.setItem('user', null);
        localStorage.removeItem('userID');
      }
    });
  }

  static isSignOut(): boolean {
    return !localStorage.getItem('user');
  }

  static getUserId(): string {
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

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  async  loginWithGoogle() {
    await  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    this.router.navigate(['/cars']);
  }

  async  loginWithFacebook() {
    await  this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
    this.router.navigate(['/cars']);
  }
}
