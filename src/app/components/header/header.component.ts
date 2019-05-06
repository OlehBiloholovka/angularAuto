import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    // return  this.authService.getUserId !== null;
    return !this.authService.isSignOut;
  }

  onLogout() {
    this.authService.logout().catch(console.log);
  }

  getUserID(): string {
    return localStorage.getItem('userID');
  }
}
