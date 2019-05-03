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
  carName: string;
  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.carService.getCurrentCar()
      .subscribe(value => {
        if (value.category.make.label) {
          console.log();
          this.carName = value.category.make.label + ' ' + value.category.make.model.label;
        }
      });
  }
  // @ViewChild('photoInput')
  // photoInput: ElementRef;
  // constructor(private carService: CarService,
  //             private toastr: ToastrService,
  //             private route: ActivatedRoute,
  //             private router: Router,
  //             private authService: AuthService) {
  //   this.carService = carService;
  //   this.authService = authService;
  // }
  //
  // ngOnInit() {
  //   // this.carService.getData();
  //   this.carService.getAllCars();
  //   this.route.queryParams.subscribe(params => {
  //     if (!params.isEdit) {
  //       this.onResetForm();
  //     }
  //   });
  // }
  //
  // onPhotoUpload(event) {
  //   this.carService.uploadPhoto(event);
  // }
  //
  // onSubmit(carForm: NgForm) {
  //   if (carForm.value.key == null) {
  //     this.carService.createCar(this.carService.selectedCar);
  //   } else {
  //     this.carService.updateCar(this.carService.selectedCar.key, this.carService.selectedCar);
  //   }
  //   this.onResetForm(carForm);
  //   this.toastr.success('Submitted Successfully', 'Car Register');
  // }
  //
  // onResetForm(carForm?: NgForm) {
  //   if (carForm != null) {
  //     carForm.reset();
  //   }
  //
  //   this.photoInput.nativeElement.value = '';
  //   this.carService.uploadPercent = undefined;
  //   this.carService.photoUrl = undefined;
  //
  //   this.carService.selectedCar = new Car();
  // }
  // onGetSelectedCar() {
  //   return this.carService.selectedCar;
  // }
  //
  // onGetUploadURL() {
  //   return this.carService.photoUrl;
  // }
  //
  // onGetUploadPercent() {
  //   return this.carService.uploadPercent;
  // }
}
