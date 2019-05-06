import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AutoRiaService} from '../../components/cars/shared/auto-ria/auto-ria.service';
import {MainParameter} from '../../components/cars/shared/auto-ria/main-parameter.model';
import {CheckboxItem} from '../../components/checkbox-group/shared/checkbox-item.model';
import {Car} from '../../components/cars/shared/car.model';
import {NgForm} from '@angular/forms';
import {CarService} from '../../components/cars/shared/car.service';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../components/cars/shared/category.model';
import {Make} from '../../components/cars/shared/make.model';
import {Region} from '../../components/cars/shared/region.model';
import {RiaItem} from '../../components/cars/shared/ria-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit, OnDestroy {
  public photoUrl: Observable<string | null>;

  constructor(private autoRiaService: AutoRiaService,
              private carService: CarService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private toastService: ToastrService) {
  }
  @ViewChild('photoInput')
  photoInput: ElementRef;
  public currentCar: Car;
// Form variables
  allOptions: Observable<CheckboxItem[]>;

// main params
  categories: MainParameter[];
  bodyStyles: MainParameter[];
  driverTypes: MainParameter[];
  engineTypes: MainParameter[];
  gearboxes: MainParameter[];
  options: MainParameter[];
  colors: MainParameter[];
  countries: MainParameter[];
  regions: MainParameter[];
  cities: MainParameter[];


// other params
  makes: MainParameter[];
  models: MainParameter[];
  years: number[] = [];

  static isThisElement(elementId: number, id: any) {
    return elementId === Number.parseInt(id, 10);
  }

  private static handleError(error: any) {
    console.log(error);
  }

  ngOnInit() {
    // if (!this.isSignedIn) {
    //   this.router.navigate(['/login']).catch(CarFormComponent.handleError);
    //   return;
    // }
    this.carService
      .getCurrentCar()
      .subscribe(value => {
        this.currentCar = value;
        if (!this.currentCar.category.gearBox) {
          this.currentCar.category.gearBox = new RiaItem();
        }
        if (!this.currentCar.engineType) {
          this.currentCar.engineType = new RiaItem();
        }
        if (!this.currentCar.category.driverType) {
          this.currentCar.category.driverType = new RiaItem();
        }
        if (!this.currentCar.color) {
          this.currentCar.color = new RiaItem();
        }
      });
    // TO change !!!!
    if (this.currentCar.photoURLs && this.currentCar.photoURLs[0]) {
      this.carService.setPhotoUrl(this.currentCar.photoURLs[0]);
    }
    //
    this.photoUrl = this.carService.getPhotoUrl();
    this.carService.getAllCars();
    this.getYears();
    this.getCategories();
    this.getEngineTypes();
    this.getColors();
    this.getCountries();
    this.getRegions();
    this.route.queryParams.subscribe(params => {
      if (!params.isEdit) {
        this.onResetForm();
      } else if (this.currentCar.key) {
        this.getMakes();
        this.getBodyStyles();
        this.getGearboxes();
        this.getOptions();
        this.getModels();
        this.getCities();
        this.getDriverTypes();
      }
    });
  }
// Main params methods
  private getCategories() {
    this.autoRiaService
      .getCategories()
      .subscribe(resp => {
        this.categories = resp;
    }, CarFormComponent.handleError);
  }

  private getBodyStyles() {
    this.autoRiaService
      .getBodyStyles(this.currentCar.category.id)
      .subscribe(resp => {
        this.bodyStyles = resp;
      }, CarFormComponent.handleError);
  }

  private getDriverTypes() {
    this.autoRiaService
      .getDriverTypes(this.currentCar.category.id)
      .subscribe(resp => {
        this.driverTypes = resp;
      }, CarFormComponent.handleError);
  }

  private getEngineTypes() {
    this.autoRiaService
      .getEngineTypes()
      .subscribe(resp => {
        this.engineTypes = resp;
      }, CarFormComponent.handleError);
  }

  private getGearboxes() {
    this.autoRiaService
      .getGearboxes(this.currentCar.category.id)
      .subscribe(resp => {
        this.gearboxes = resp;
      }, CarFormComponent.handleError);
  }

  private getOptions() {
    this.autoRiaService
      .getOptions(this.currentCar.category.id)
      .subscribe(resp => {
        this.options = resp;
        this.allOptions = of(resp.map(opt => new CheckboxItem(opt.value, opt.name)));
      }, CarFormComponent.handleError);
  }

  private getColors() {
    this.autoRiaService
      .getColors()
      .subscribe(resp => {
        this.colors = resp;
      }, CarFormComponent.handleError);
  }

  private getCountries() {
    this.autoRiaService
      .getCountries()
      .subscribe(resp => {
        this.countries = resp;
      }, CarFormComponent.handleError);
  }

  private getRegions() {
    this.autoRiaService
      .getStates()
      .subscribe(resp => {
        this.regions = resp;
      }, CarFormComponent.handleError);
  }

  private getCities() {
    this.autoRiaService
      .getCities(this.currentCar.region.id)
      .subscribe(resp => {
        this.cities = resp;
      }, CarFormComponent.handleError);
  }

// Other params methods
  private getMakes() {
    this.autoRiaService
      .getMakes(this.currentCar.category.id)
      .subscribe(resp => {
        this.makes = resp;
      }, CarFormComponent.handleError);
  }

  private getModels() {
    this.autoRiaService
      .getModels(this.currentCar.category.id, this.currentCar.category.make.id)
      .subscribe(resp => {
        this.models = resp;
      }, CarFormComponent.handleError);
  }

  onChangeCategory(event: any) {
    const category: Category = new Category();
    category.id = event;
    this.currentCar.category = category;
    this.getDriverTypes();
    this.getMakes();
    this.getBodyStyles();
    this.getGearboxes();
    this.getOptions();
  }

  onChangeMake(event: any) {
    if (event) {
      const make: Make = new Make();
      make.id = Number.parseInt(event, 10);
      this.currentCar.category.make = make;
      this.getModels();
    } else {
      return;
    }
  }

  onChangeModel(event: any) {
    const model: RiaItem = new RiaItem();
    model.id = Number.parseInt(event, 10);
    this.currentCar.category.make.model = model;
  }

  onChangeEngineType(event: any) {
    const engineType: RiaItem = new RiaItem();
    // engineType.id = Number.parseInt(event, 10);
    engineType.id = event;
    this.currentCar.engineType = engineType;
  }

  onChangeRegion(event: any) {
    const region: Region = new Region();
    region.id = event;
    this.currentCar.region = region;
    this.getCities();
  }

  onOptionsChange(values) {
    this.currentCar.category.options = values.map(v => {
      const option = new RiaItem();
      option.id = v;
      return option;
    });
  }

  private getYears() {
    const date = new Date();
    const fullYear = date.getFullYear();
    for (let i = fullYear; i >= 1900; i--) {
      this.years.push(i);
    }
  }

  onSubmit(carForm: NgForm) {
    this.currentCar.category.make.label = this.makes
      .find(value =>  CarFormComponent.isThisElement(value.value, this.currentCar.category.make.id)).name;
    this.currentCar.category.make.model.label = this.models
      .find(value =>  CarFormComponent.isThisElement(value.value, this.currentCar.category.make.model.id)).name;
    if (this.currentCar.engineType && this.currentCar.engineType.id) {
      this.currentCar.engineType.label = this.engineTypes
        .find(value =>  CarFormComponent.isThisElement(value.value, this.currentCar.engineType.id)).name;
    }
    if (carForm.value.key == null) {
      this.carService.createCar(this.currentCar);
    } else {
      this.carService.updateCar(this.currentCar.key, this.currentCar);
    }
    this.toastService.success('Submitted Successfully', 'Car Register');
    this.onResetForm(carForm);
    this.router.navigate(['user/' + this.carService.userID + '/cars']).catch(CarFormComponent.handleError);
  }

  onResetForm(carForm?: NgForm) {
    if (carForm != null) {
      carForm.reset();
    }

    this.photoInput.nativeElement.value = '';
    this.carService.uploadPercent = undefined;
    this.carService.setPhotoUrl();
    this.carService.setCurrentCar();
  }

  onPhotoUpload(event) {
    this.carService.uploadPhoto(event);
  }

  onGetUploadPercent() {
    return this.carService.uploadPercent;
  }

  ngOnDestroy(): void {
    this.carService.setCurrentCar();
  }
}
