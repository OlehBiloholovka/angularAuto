import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car.service';
import { NgForm } from '@angular/forms';
import {modelGroupProvider} from '@angular/forms/src/directives/ng_model_group';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.onResetForm();
  }

  onSubmit(carForm: NgForm) {
  }

  onResetForm(carForm: NgForm) {
    if (carForm != null) carForm.reset();
    this.carService.selectedCar = {
      $key: null,
      name: '',
      model: '',
      year: 2000,
      engine: 0.0,
      engineType: '',
      mileage: 10000,
      options: []
    };
  }
}
