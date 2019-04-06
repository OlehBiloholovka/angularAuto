import { Component, OnInit } from '@angular/core';
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
      // const car: Car = Object.assign({}, carForm.value);
      // carForm.value.userID = this.authService.user.uid;
      // const car: Car = carForm.value;
      this.carService.selectedCar.userID = this.authService.user.uid;
      // this.carService.photoURL.pipe().subscribe(url => this.carService.selectedCar.photoURLs.push(url));
      // car.photoURLs.push(this.carService.photoURL.pipe(finalize()));
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
    this.carService.selectedCar = new Car();
    // this.carService.selectedCar = {
    //   $key: null,
    //   name: '',
    //   model: '',
    //   year: 2000,
    //   engine: 0.0,
    //   engineType: '',
    //   mileage: 10000,
    //   price: 10000
    //   // ,
    //   // options: []
    // };
  }
  onGetSelectedCar() {
    return this.carService.selectedCar;
  }

  onGetUploadURL() {
    return this.carService.photoURLs;
  }

  onGetUploadPercent() {
    return this.carService.uploadPercent;
  }
}
