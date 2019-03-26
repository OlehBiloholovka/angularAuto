import { Component, OnInit } from '@angular/core';
import { CarService  } from '../shared/car.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  constructor(private carService: CarService) { }

  ngOnInit() {
  }

}
