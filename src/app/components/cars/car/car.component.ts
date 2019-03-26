import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  constructor(private carService: CarService, private toastr: ToastrService) { }

  ngOnInit() {
    this.carService.getData();
    this.onResetForm();
  }

  onSubmit(carForm: NgForm) {
    this.carService.insertCar(carForm.value);
    this.onResetForm(carForm);
    this.toastr.success('Submitted Successfully', 'Car Register');
  }

  onResetForm(carForm?: NgForm) {
    if (carForm != null) carForm.reset();
    this.carService.selectedCar = {
      $key: null,
      name: '',
      model: '',
      year: 2000,
      engine: 0.0,
      engineType: '',
      mileage: 10000
      // ,
      // options: []
    };
  }
}
