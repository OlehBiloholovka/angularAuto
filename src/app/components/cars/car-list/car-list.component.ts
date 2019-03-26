import { Component, OnInit } from '@angular/core';
import { CarService  } from '../shared/car.service';
import { Car } from '../shared/car.model';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  carList: Car[];

  constructor(private carService: CarService) { }

  ngOnInit() {
    const data = this.carService.getData();
    data.snapshotChanges().subscribe(item => {
      this.carList = [];
      item.forEach(element => {
        let e = element.payload.toJSON();
        e['$key'] = element.key;
        this.carList.push(e as Car);
      });
    });
  }

  onEdit(car: Car) {
    this.carService.selectedCar = Object.assign({}, car);
  }
}
