import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Car } from '../shared/car.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  constructor(private carService: CarService, private toastr: ToastrService, private route: ActivatedRoute) {
    this.carService = carService;
  }

  ngOnInit() {
    this.carService.getData();
    this.route.queryParams.subscribe(params => {
      if (!params['isEdit']) {
        this.onResetForm();
      }
    });
  }

  onSubmit(carForm: NgForm) {
    if (carForm.value.$key == null) {
      this.carService.insertCar(carForm.value);
    } else {
      this.carService.updateCar(carForm.value);
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
}
