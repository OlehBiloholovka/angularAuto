import { Component, OnInit } from '@angular/core';
import { CarService  } from '../shared/car.service';
import { Car } from '../shared/car.model';
import { ToastrService } from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  carList: Observable<Car[]>;
  id: string;

  constructor(private carService: CarService,
              private toastr: ToastrService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;

    });
    this.getCars(this.id);
  }

  getCars(userID?: string): void {
    this.carList = userID
      ? this.carService.getCarsByUserID(userID).valueChanges()
      : this.carList = this.carService.getAllCars().valueChanges();
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
    if (this.authService.isLoggedIn) {
      return  userID === this.authService.user.uid ;
    }
    return false;
  }
}
