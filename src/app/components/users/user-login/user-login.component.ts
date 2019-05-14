import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../core/auth.service';
import {WindowService} from '../../../core/window.service';
import {User} from 'firebase';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  onLogin(email: string, password: string) {
    this.authService.login(email, password);
  }


  onLoginWithGoogle() {
    this.authService.loginWithGoogle().catch(console.log);
  }

  onLoginWithPhone() {
    this.authService.loginWithPhone().catch(console.log);
  }

  onLoginWithFacebook() {
    this.authService.loginWithFacebook();
  }
}
