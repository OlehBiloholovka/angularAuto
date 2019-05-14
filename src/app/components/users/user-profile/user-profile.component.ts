import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocationService} from '../../../core/location.service';
import {AutoRiaService} from '../../cars/shared/auto-ria/auto-ria.service';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../core/auth.service';
import {User} from '../../../core/user.model';
import {Observable, Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {PhoneNumber} from '../../../core/phone-number.model';
import {WindowService} from '../../../core/window.service';
import * as firebase from 'firebase/app';
import ConfirmationResult = firebase.auth.ConfirmationResult;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: Observable<User>;
  user: User;
  isEdit: boolean;
  private userSubscription: Subscription;
  private formUser: User;
  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;
  isReCAPTCHA: boolean;
  isPhoneVerified: boolean;
  confirmationResult: ConfirmationResult;

  constructor(private authService: AuthService,
              private locationService: LocationService,
              private autoRiaService: AutoRiaService,
              private toastService: ToastrService,
              private windowService: WindowService) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userSubscription = this.currentUser
        .subscribe(value => this.user = value);
    }
    this.windowRef = this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container'
      , {callback: () => this.isReCAPTCHA = true});
    this.windowRef.recaptchaVerifier.render().catch(console.log);
  }

  onSubmit(carForm: NgForm) {
    if (this.user.phoneNumber || this.isPhoneVerified) {
      this.onUserEdit();
      this.formUser = carForm.value;
      this.formUser.uid = this.user.uid;
      this.authService.updateUserData(carForm.value);
    }
  }

  onCancelForm(carForm: NgForm) {
    this.onUserEdit();
    this.isPhoneVerified = false;
    this.confirmationResult = undefined;
    carForm.resetForm(this.user);
  }

  onUserEdit() {
    this.isEdit = !this.isEdit;
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  verifyPhone() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    this.authService.signInWithPhoneNumber(num, appVerifier)
        .then(result => {
          this.confirmationResult = result;
        })
        .catch(console.log);
  }
  confirmPhone() {
    // this.confirmationResult
    //   .confirm(this.verificationCode)
    //   .then(() => this.isPhoneVerified = true)
    //   .catch(alert);
    this.updatePhone();
  }
  updatePhone() {
    this.authService
      .updatePhone(this.confirmationResult.verificationId, this.verificationCode)
      .then(() => this.isPhoneVerified = true)
      .catch(alert);
  }
}
