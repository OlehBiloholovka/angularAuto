import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  onLogout() {
    this.authService.logout();
  }

  getUserID(): string {
    return localStorage.getItem('userID');
  }
}
