import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CarService } from '../shared/car.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Car } from '../shared/car.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  @ViewChild('photoInput')
  photoInput: ElementRef;
  constructor(private carService: CarService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    this.carService = carService;
    this.authService = authService;
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
    this.carService.getData();
    this.route.queryParams.subscribe(params => {
      if (!params.isEdit) {
        this.onResetForm();
      }
    });
  }

  onPhotoUpload(event) {
    this.carService.uploadPhoto(event);
  }

  onSubmit(carForm: NgForm) {
    if (carForm.value.$key == null) {
      this.carService.selectedCar.userID = this.authService.user.uid;
      this.carService.insertCar(this.carService.selectedCar);
    } else {
      this.carService.updateCar(this.carService.selectedCar);
    }
    this.onResetForm(carForm);
    this.toastr.success('Submitted Successfully', 'Car Register');
  }

  onResetForm(carForm?: NgForm) {
    if (carForm != null) {
      carForm.reset();
    }

    this.photoInput.nativeElement.value = '';
    this.carService.uploadPercent = undefined;
    this.carService.photoUrl = undefined;

    this.carService.selectedCar = new Car();
  }
  onGetSelectedCar() {
    return this.carService.selectedCar;
  }

  onGetUploadURL() {
    return this.carService.photoUrl;
  }

  onGetUploadPercent() {
    return this.carService.uploadPercent;
  }
}
