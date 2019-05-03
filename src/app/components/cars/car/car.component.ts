import {Component, OnInit} from '@angular/core';
import { CarService } from '../shared/car.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  carName: string;
  isUserCar: boolean;
  carId: string;
  constructor(private carService: CarService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.carService.getCurrentCar()
      .subscribe(value => {
        this.carId = value.key;
        if (value.category.make.label) {
          this.carName = value.category.make.label + ' ' + value.category.make.model.label;
        }
        if (!AuthService.isSignOut()) {
          this.isUserCar = value.userID === AuthService.getUserId();
        }
      });
  }
  onEdit() {
    this.router.navigate(['user/form'], {queryParams: {isEdit: true}}).catch(console.log);
  }
  onDelete() {
    if (confirm('Are sure to delete this record?') === true) {
      this.carService.deleteCar(this.carId);
      this.toastr.warning('Deleted Successfully', 'Car register');
    }
  }
}
