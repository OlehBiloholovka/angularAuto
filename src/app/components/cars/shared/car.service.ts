import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Car} from './car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  carList: AngularFireList<any>;
  selectedCar: Car = new Car();

  constructor(private firebase: AngularFireDatabase) { }

  getData() {
    this.carList = this.firebase.list('cars');
    return this.carList;
  }

  insertCar(car: Car) {
    this.carList.push({
      name: car.name,
      model: car.model,
      year: car.year,
      engine: car.engine,
      engineType: car.engineType,
      kilometrage: car.kilometrage,
      options: car.options
    });
  }

  updateCar(car: Car) {
     this.carList.update(car.$key,
       {
         name: car.name,
         model: car.model,
         year: car.year,
         engine: car.engine,
         engineType: car.engineType,
         kilometrage: car.kilometrage,
         options: car.options
     });
  }

  deleteCar($key: string) {
    this.carList.remove($key);
  }
}
