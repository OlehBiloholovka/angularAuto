import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import { CarService } from '../shared/car.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {Observable, Subscription} from 'rxjs';
import {Car} from '../shared/car.model';
import {AutoRiaService} from '../shared/auto-ria/auto-ria.service';
import {map} from 'rxjs/operators';
import {User} from '../../../core/user.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ScrollTopService} from '../../../core/scroll-top.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  animations: [
    trigger('scrollAnimation', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hide',   style({
        opacity: 0,
        transform: 'translateY(-110%)'
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('300ms ease-in'))
    ])
  ]
})
export class CarComponent implements OnInit, OnDestroy {
  state = 'hide';
  car: Car;
  carName: string;
  isUserCar: boolean;
  carId: string;
  carUser: Observable<User>;
  private currentCarSubscription: Subscription;
  constructor(private carService: CarService,
              private toastr: ToastrService,
              private authService: AuthService,
              private autoRiaService: AutoRiaService,
              private scrollTopService: ScrollTopService,
              private router: Router,
              public el: ElementRef) {
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop;
    const scrollPosition = window.pageYOffset;

    if (scrollPosition >= componentPosition) {
      this.state = 'show';
    } else {
      this.state = 'hide';
    }
  }

  ngOnInit(): void {
    this.scrollTopService.setScrollTop();
    this.currentCarSubscription = this.carService.getCurrentCar()
      .subscribe(value => {
        this.car = value;
        this.carId = value.key;
        if (this.carId === undefined) {
          this.router.navigate(['']).catch(console.log);
          return;
        }
        this.carUser = this.authService.getUserData(value.userID);
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
    if (currentCar.color && currentCar.color.id) {
      this.autoRiaService.getColors()
        .pipe(
          map(colors =>
            colors.filter(color => color.value.toString() === currentCar.color.id.toString())),
          map(colors => colors[0].name)
        )
        .subscribe(v => this.car.color.label = v);
    }
    if (currentCar.engineType && currentCar.engineType.id) {
      this.autoRiaService.getEngineTypes()
        .pipe(
          map(engineTypes =>
            engineTypes.filter(engineType => engineType.value.toString() === currentCar.engineType.id.toString())),
          map(engineType => engineType[0].name)
        )
        .subscribe(v => this.car.engineType.label = v);
    }
    this.autoRiaService.getBodyStyles(currentCar.category.id)
      .pipe(
        map(bodyStyles =>
          bodyStyles.filter(bodyStyle => bodyStyle.value.toString() === currentCar.category.bodyStyle.id.toString())),
        map(bodyStyle => bodyStyle[0].name)
      )
      .subscribe(v => this.car.category.bodyStyle.label = v);
    if (currentCar.category.gearBox && currentCar.category.gearBox.id) {
      this.autoRiaService.getGearboxes(currentCar.category.id)
        .pipe(
          map(gearboxes =>
            gearboxes.filter(gearbox => gearbox.value.toString() === currentCar.category.gearBox.id.toString())),
          map(gearboxes => gearboxes[0].name)
        )
        .subscribe(v => this.car.category.gearBox.label = v);
    }
    if (currentCar.category.driverType && currentCar.category.driverType.id) {
      this.autoRiaService.getDriverTypes(currentCar.category.id)
        .pipe(
          map(driverTypes =>
            driverTypes.filter(driverType => driverType.value.toString() === currentCar.category.driverType.id.toString())),
          map(driverTypes => driverTypes[0].name)
        )
        .subscribe(v => this.car.category.driverType.label = v);
    }
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
    if (currentCar.category.options) {
      this.autoRiaService.getOptions(currentCar.category.id)
        .subscribe(options => {
          this.car.category.options.forEach(option => {
            option.label = options
              .filter(o => o.value.toString() === option.id.toString())[0].name;
          });
        });
    }
    return currentCar;
  }
  onEdit() {
    this.router.navigate(['user/form'], {queryParams: {isEdit: true}}).catch(console.log);
  }
  onDelete() {
    if (confirm('Are sure to delete this record?') === true) {
      this.carService.deleteCar(this.carId);
      this.toastr.warning('Deleted Successfully', 'Car register');
      this.router.navigate(['']).catch(console.log);
    }
  }

  ngOnDestroy(): void {
    this.currentCarSubscription.unsubscribe();
  }

  onOpenUserCars(uid: string) {
    this.router.navigate(['/cars', uid]).catch(console.log);
  }
}
