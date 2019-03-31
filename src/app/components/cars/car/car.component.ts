import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Car } from '../shared/car.model';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {headersToString} from 'selenium-webdriver/http';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  constructor(private carService: CarService, private toastr: ToastrService, private route: ActivatedRoute, private http: HttpClient) { }

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

  onGetCarMakes() {
    const headers = new Headers({ 'X-AS24-Version': '1.1', 'Accept-Language': 'en-GB' });
    const https = this.http.get('https://api.autoscout24.com/makes', headers);
    // console.log(https.pipe);
    // this.http.get(headersToString('X-AS24-Version: 1.1', 'Accept-Language: en-GB'), );
  }

}
