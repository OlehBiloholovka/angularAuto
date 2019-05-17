import { Component, OnInit } from '@angular/core';
import {AuthService} from '../core/auth.service';
import {Router} from '@angular/router';
import {ScrollTopService} from '../core/scroll-top.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(private router: Router,
              private scrollTopService: ScrollTopService,
              private authService: AuthService) { }

  ngOnInit() {
    this.scrollTopService.setScrollTop();
    if (!this.isSignedIn) {
      this.router.navigate(['/login']).catch(console.log);
      // return;
    }
  }
  get isSignedIn(): boolean {
    return !this.authService.isSignOut;
  }

}
