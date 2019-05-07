import {Component, OnDestroy, OnInit} from '@angular/core';
import { CarService } from '../shared/car.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {Observable, Subscription} from 'rxjs';
import {Car} from '../shared/car.model';
import {User} from 'firebase';
import {AutoRiaService} from '../shared/auto-ria/auto-ria.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit, OnDestroy {
  car: Car;
  carName: string;
  isUserCar: boolean;
  carId: string;
  user: User;
  userPhoto: Observable<string>;
  userName: Observable<string>;
  userEmail: Observable<string>;
  userPhone: Observable<string>;
  private currentCarSubscription: Subscription;
  private currentUserSubscription: Subscription;
  constructor(private carService: CarService,
              private toastr: ToastrService,
              private authService: AuthService,
              private autoRiaService: AutoRiaService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.afAuth.authState
      .subscribe(u => this.user = u);
    this.userPhoto = this.authService.afAuth.authState
      .pipe(map(u => u.photoURL));
    this.userName = this.authService.afAuth.authState
      .pipe(map(u => u.displayName));
    this.userEmail = this.authService.afAuth.authState
      .pipe(map(u => u.email));
    this.userPhone = this.authService.afAuth.authState
      .pipe(map(u => u.phoneNumber));
    this.currentCarSubscription = this.carService.getCurrentCar()
      .subscribe(value => {
        this.car = value;
        this.carId = value.key;
        if (this.carId === undefined) {
          this.router.navigate(['']).catch(console.log);
          return;
        }
        if (value.category.make.label) {
          this.carName = value.category.make.label + ' ' + value.category.make.model.label;
        }
        this.isUserCar = value.userID === this.authService.getUserId;
        this.insertLabels(value);
      });
  }
  private insertLabels(currentCar: Car): Car {
    this.autoRiaService.getStates()
      .pipe(
        map(regions =>
          regions.filter(region => region.value.toString() === currentCar.region.id.toString())),
        map(regions => regions[0].name)
      ).subscribe(v => this.car.region.label = v);
    this.autoRiaService.getCities(currentCar.region.id)
      .pipe(
        map(cities =>
          cities.filter(city => city.value.toString() === currentCar.region.city.id.toString())),
        map(cities => cities[0].name)
      )
      .subscribe(v => this.car.region.city.label = v);
    this.autoRiaService.getColors()
      .pipe(
        map(colors =>
          colors.filter(color => color.value.toString() === currentCar.color.id.toString())),
        map(colors => colors[0].name)
      )
      .subscribe(v => this.car.color.label = v);
    this.autoRiaService.getEngineTypes()
      .pipe(
        map(engineTypes =>
          engineTypes.filter(engineType => engineType.value.toString() === currentCar.engineType.id.toString())),
        map(engineType => engineType[0].name)
      )
      .subscribe(v => this.car.engineType.label = v);
    this.autoRiaService.getBodyStyles(currentCar.category.id)
      .pipe(
        map(bodyStyles =>
          bodyStyles.filter(bodyStyle => bodyStyle.value.toString() === currentCar.category.bodyStyle.id.toString())),
        map(bodyStyle => bodyStyle[0].name)
      )
      .subscribe(v => this.car.category.bodyStyle.label = v);
    this.autoRiaService.getGearboxes(currentCar.category.id)
      .pipe(
        map(gearboxes =>
          gearboxes.filter(gearbox => gearbox.value.toString() === currentCar.category.gearBox.id.toString())),
        map(gearboxes => gearboxes[0].name)
      )
      .subscribe(v => this.car.category.gearBox.label = v);
    this.autoRiaService.getDriverTypes(currentCar.category.id)
      .pipe(
        map(driverTypes =>
          driverTypes.filter(driverType => driverType.value.toString() === currentCar.category.driverType.id.toString())),
        map(driverTypes => driverTypes[0].name)
      )
      .subscribe(v => this.car.category.driverType.label = v);
    this.autoRiaService.getModels(currentCar.category.id, currentCar.category.make.id)
      .pipe(
        map(models =>
          models.filter(model => model.value.toString() === currentCar.category.make.model.id.toString())),
        map(models => models[0].name)
      )
      .subscribe(v => this.car.category.make.model.label = v);
    this.autoRiaService.getMakes(currentCar.category.id)
      .pipe(
        map(makes =>
          makes.filter(make => make.value.toString() === currentCar.category.make.id.toString())),
        map(makes => makes[0].name)
      )
      .subscribe(v => this.car.category.make.label = v);
    this.autoRiaService.getCategories()
      .pipe(
        map(categories =>
          categories.filter(category => category.value.toString() === currentCar.category.id.toString())),
        map(categories => categories[0].name)
      )
      .subscribe(v => this.car.category.label = v);
    this.autoRiaService.getOptions(currentCar.category.id)
      .subscribe(options => {
        this.car.category.options.forEach(option => {
          option.label = options
            .filter(o => o.value.toString() === option.id.toString())[0].name;
        });
      });
    return currentCar;
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

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.currentCarSubscription.unsubscribe();
  }
}
