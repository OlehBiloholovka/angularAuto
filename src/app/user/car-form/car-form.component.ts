import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {
  @ViewChild('photoInput')
  photoInput: ElementRef;

  constructor(private autoRiaService: AutoRiaService,
              private carService: CarService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private toastService: ToastrService) { }
  public currentCar: Car;
// Form variables
  carOptions = new Array<CheckboxItem>();

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

  static isThisElement(elementId: number, id: number) {
    return elementId === id;
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']).catch(console.log);
    }
    this.currentCar = this.carService.selectedCar;
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
      } else {
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
    }, error => console.log(error));
  }

  private getBodyStyles() {
    this.autoRiaService
      .getBodyStyles(this.currentCar.category.id)
      .subscribe(resp => {
        this.bodyStyles = resp;
      }, error => console.log(error));
  }

  private getDriverTypes() {
    this.autoRiaService
      .getDriverTypes(this.currentCar.category.id)
      .subscribe(resp => {
        this.driverTypes = resp;
      }, error => console.log(error));
  }

  private getEngineTypes() {
    this.autoRiaService
      .getEngineTypes()
      .subscribe(resp => {
        this.engineTypes = resp;
      }, error => console.log(error));
  }

  private getGearboxes() {
    this.autoRiaService
      .getGearboxes(this.currentCar.category.id)
      .subscribe(resp => {
        this.gearboxes = resp;
      }, error => console.log(error));
  }

  private getOptions() {
    this.autoRiaService
      .getOptions(this.currentCar.category.id)
      .subscribe(resp => {
        this.options = resp;
        this.carOptions = resp.map(opt => new CheckboxItem(opt.value, opt.name));
      }, error => console.log(error));
  }

  private getColors() {
    this.autoRiaService
      .getColors()
      .subscribe(resp => {
        this.colors = resp;
      }, error => console.log(error));
  }

  private getCountries() {
    this.autoRiaService
      .getCountries()
      .subscribe(resp => {
        this.countries = resp;
      }, error => console.log(error));
  }

  private getRegions() {
    this.autoRiaService
      .getStates()
      .subscribe(resp => {
        this.regions = resp;
      }, error => console.log(error));
  }

  private getCities() {
    this.autoRiaService
      .getCities(this.currentCar.region.id)
      .subscribe(resp => {
        this.cities = resp;
      }, error => console.log(error));
  }

// Other params methods
  private getMakes() {
    this.autoRiaService
      .getMakes(this.currentCar.category.id)
      .subscribe(resp => {
        this.makes = resp;
      }, error => console.log(error));
  }

  private getModels() {
    this.autoRiaService
      .getModels(this.currentCar.category.id, this.currentCar.category.make.id)
      .subscribe(resp => {
        this.models = resp;
      }, error => console.log(error));
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
    const make: Make = new Make();
    make.id = Number.parseInt(event, 10);
    this.currentCar.category.make = make;
    this.getModels();
  }

  onChangeModel(event: any) {
    const model: RiaItem = new RiaItem();
    model.id = Number.parseInt(event, 10);
    this.currentCar.category.make.model = model;
  }

  onChangeEngineType(event: any) {
    const engineType: RiaItem = new RiaItem();
    engineType.id = Number.parseInt(event, 10);
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
    this.currentCar.engineType.label = this.engineTypes
      .find(value =>  CarFormComponent.isThisElement(value.value, this.currentCar.engineType.id)).name;
    if (carForm.value.key == null) {
      this.carService.createCar(this.currentCar);
    } else {
      this.carService.updateCar(this.currentCar.key, this.currentCar);
    }
    this.onResetForm(carForm);
    this.toastService.success('Submitted Successfully', 'Car Register');
  }

  onResetForm(carForm?: NgForm) {
    if (carForm != null) {
      carForm.reset();
    }

    this.photoInput.nativeElement.value = '';
    this.carService.uploadPercent = undefined;
    this.carService.photoUrl = undefined;

    this.carService.selectedCar = new Car();
  }

  onPhotoUpload(event) {
    this.carService.uploadPhoto(event);
  }

  onGetUploadURL() {
    return this.carService.photoUrl;
  }

  onGetUploadPercent() {
    return this.carService.uploadPercent;
  }
}
