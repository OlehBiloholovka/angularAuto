import { Component, OnInit } from '@angular/core';
import { CarService  } from '../shared/car.service';
import { Car } from '../shared/car.model';
import { ToastrService } from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
      ? this.carService.getCarsByUserID(userID)
        .snapshotChanges()
        .pipe(
          map(value =>
            value.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
      : this.carService.getAllCars()
        .snapshotChanges()
        .pipe(
          map(value =>
            value.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
  }

  onEdit(car: Car) {
    this.carService.setCurrentCar(Object.assign({}, car));
    this.router.navigate(['user/form'], {queryParams: {isEdit: true}}).catch(console.log);
  }
  onDelete(key: string) {
    if (confirm('Are sure to delete this record?') === true) {
      this.carService.deleteCar(key);
      this.toastr.warning('Deleted Successfully', 'Car register');
    }
  }
  onOpenCarPage(car: Car) {
    this.carService.setCurrentCar(Object.assign({}, car));
    this.router.navigate(['car'])
      .catch(console.log);
  }

  isUserCar(userID: string): boolean {
    return userID === this.authService.getUserId;
  }
}
