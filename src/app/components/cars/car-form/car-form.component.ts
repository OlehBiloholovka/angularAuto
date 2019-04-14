import {Component, OnInit} from '@angular/core';
import {AutoRiaService} from '../shared/auto-ria/auto-ria.service';
import {MainParameter} from '../shared/auto-ria/main-parameter.model';
import {Make} from '../shared/auto-ria/make.model';
import {Model} from '../shared/auto-ria/model.model';
import {Generation} from '../shared/auto-ria/generation.model';
import {GenerationBodyStyle} from '../shared/auto-ria/generation-bodystyle.model';
import {Modification} from '../shared/auto-ria/modification.model';
import {Equip} from '../shared/auto-ria/equip.model';
import {CheckboxItem} from '../../checkbox-group/shared/checkbox-item.model';
import {Car} from '../shared/car.model';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {
  public currentCar: Car = new Car();
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
  states: MainParameter[];
  cities: MainParameter[];

// selected main params
  selectedCategoryID: number;
  selectedBodyStyleID: number;
  selectedDriverType: number;
  selectedEngineType: number;
  selectedGearboxID: number;
  selectedOptionID: number;
  selectedColorID: number;
  selectedCountryID: number;
  selectedStateID: number;
  selectedCityID: number;

// other params
  makes: Make[];
  selectedMakeID: number;
  models: Model[];
  selectedModelID: number;
  generations: Generation[];
  selectedGenerationID: number;
  generationBodyStyles: GenerationBodyStyle[];
  selectedGenerationBodyStyleID: number;
  modifications: Modification[];
  selectedModificationID: number;
  equips: Equip[];
  selectedEquipID: number;

  constructor(private autoRiaService: AutoRiaService) { }

  ngOnInit() {
    this.getCategories();
    this.getEngineTypes();
    this.getColors();
    this.getCountries();
    this.getStates();
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
      .getBodyStyles(this.selectedCategoryID)
      .subscribe(resp => {
        this.bodyStyles = resp;
      }, error => console.log(error));
  }

  private getDriverTypes() {
    this.autoRiaService
      .getDriverTypes(this.selectedCategoryID)
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
      .getGearboxes(this.selectedCategoryID)
      .subscribe(resp => {
        this.gearboxes = resp;
      }, error => console.log(error));
  }

  private getOptions() {
    this.autoRiaService
      .getOptions(this.selectedCategoryID)
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

  private getStates() {
    this.autoRiaService
      .getStates()
      .subscribe(resp => {
        this.states = resp;
      }, error => console.log(error));
  }

  private getCities() {
    this.autoRiaService
      .getCities(this.selectedStateID)
      .subscribe(resp => {
        this.cities = resp;
      }, error => console.log(error));
  }

// Other params methods
  private getMakes() {
    this.autoRiaService
      .getMakes(this.selectedCategoryID)
      .subscribe(resp => {
        this.makes = resp;
      }, error => console.log(error));
  }

  private getModels() {
    this.autoRiaService
      .getModels(this.selectedCategoryID, this.selectedMakeID)
      .subscribe(resp => {
        this.models = resp;
      }, error => console.log(error));
  }

  private getGenerations() {
    this.autoRiaService
      .getGenerations(this.selectedModelID)
      .subscribe(resp => {
        this.generations = resp;
      }, error => console.log(error));
  }

  private getGenerationBodystyles() {
    this.autoRiaService
      .getGenerationBodyStyles(this.selectedGenerationID)
      .subscribe(resp => {
        this.generationBodyStyles = resp;
      }, error => console.log(error));
  }

  private getModifications() {
    this.autoRiaService
      .getModifications(this.selectedGenerationBodyStyleID)
      .subscribe(resp => {
        this.modifications = resp;
      }, error => console.log(error));
  }

  private getEquips() {
    this.autoRiaService
      .getEquips(this.selectedModificationID)
      .subscribe(resp => {
        this.equips = resp;
      }, error => console.log(error));
  }

  onChangeCategory() {
    this.getBodyStyles();
    this.getDriverTypes();
    this.getGearboxes();
    this.getOptions();
    this.getMakes();
  }

  onChangeState() {
    this.getCities();
  }

  onOptionsChange(value) {
    this.currentCar.options = value;
    console.log('Car options:' , this.currentCar.options);
  }
}
