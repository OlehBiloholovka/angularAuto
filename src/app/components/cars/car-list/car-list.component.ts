import { Component, OnInit } from '@angular/core';
import { CarService  } from '../shared/car.service';
import { Car } from '../shared/car.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  carList: Car[];

  constructor(private carService: CarService,
              private toastr: ToastrService,
              private router: Router,
              private authServise: AuthService) { }

  ngOnInit() {
    const data = this.carService.getData();
    data.snapshotChanges().subscribe(item => {
      this.carList = [];
      item.forEach(element => {
        const e = element.payload.toJSON();
        (e as Car).$key = element.key;
        this.carList.push(e as Car);
      });
    });
  }

  onEdit(car: Car) {
    this.carService.selectedCar = Object.assign({}, car);
    this.router.navigate(['/car'], {queryParams: {isEdit: true}});
  }

  onDelete(key: string) {
    if (confirm('Are sure to delete this record?') === true) {
      this.carService.deleteCar(key);
      this.toastr.warning('Deleted Successfully', 'Car register');
    }
  }

  isUserCar(userID: string) {
    return  userID === this.authServise.user.uid;
  }
}
