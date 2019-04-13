import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MainParameter} from './main-parameter.model';
import {Observable} from 'rxjs';
import {Make} from './make.model';
import {Model} from './model.model';
import {Generation} from './generation.model';
import {GenerationBodyStyle} from './generation-bodystyle.model';
import {Modification} from './modification.model';
import {Equip} from './equip.model';

@Injectable({
  providedIn: 'root'
})
export class AutoRiaService {

// RIA API key
  private RIA_API_KEY = 'g4xVXIHQa9PNQmmw8bw1xD38YQQFQne5T3e46ETn';
  private apiKey = 'api_key';

// RIA language params
  private languageKey = 'langId';
  private uaValue = '4';
  private enValue = '5';
  private ruValue = '2';
  private languageValue = this.uaValue;

// RIA main params urls
  private url = 'https://developers.ria.com/auto';
  private categoryUrl = '/categories/';
  private bodyStyleUrl = '/bodystyles';
  private driverTypeUrl = '/driverTypes';
  private engineTypeUrl = '/type';
  private gearboxUrl = '/gearboxes';
  private optionUrl = '/options';
  private colorUrl = '/colors';
  private countryUrl = '/countries';
  private stateUrl = '/states';
  private cityUrl = '/cities';

// RIA main params keys
  private categoryKey = 'category_id';

// RIA other params urls
// RIA other params keys
  private makeUrl = '/new/marks';
  private makeKey = 'marka_id';
  private modelUrl = '/new/models';
  private modelKey = 'model_id';
  private generationUrl = '/new/generation';
  private generationKey = 'generation_id';
  private generationBodyStyleUrl = '/new/generation_bodystyles';
  private generationBodyStyleKey = 'generation_bodystyle_id';
  private modificationUrl = '/new/generation_bodystyles_bases';
  private modificationKey = 'base_id';
  private equipUrl = '/new/equip_base';

  constructor(private http: HttpClient) { }

// Makes new params for query
  private getNewParams(): HttpParams {
    return new HttpParams()
      .set(this.apiKey, this.RIA_API_KEY).append(this.languageKey, this.languageValue);
  }
// Main params queries
  getCategories(): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.categoryUrl, options);
  }

  getBodyStyles(categoryID: number): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.categoryUrl + categoryID + this.bodyStyleUrl, options);
  }

  getDriverTypes(categoryID: number): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.categoryUrl + categoryID + this.driverTypeUrl, options);
  }

  getEngineTypes(): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.engineTypeUrl, options);
  }

  getGearboxes(categoryID: number): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.categoryUrl + categoryID + this.gearboxUrl, options);
  }

  getOptions(categoryID: number): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.categoryUrl + categoryID + this.optionUrl, options);
  }

  getColors(): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.colorUrl, options);
  }

  getCountries(): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.countryUrl, options);
  }

  getStates(): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.stateUrl, options);
  }

  getCities(stateID: number): Observable<MainParameter[]> {
    const options = {params: this.getNewParams()};
    return this.http.get<MainParameter[]>(this.url + this.stateUrl + stateID + this.cityUrl, options);
  }

// Other params queries
  getMakes(categoryID: number): Observable<Make[]> {
    const options = {params: new HttpParams()
        .set(this.apiKey, this.RIA_API_KEY)
        .append(this.categoryKey, categoryID.toString())};
    return this.http.get<Make[]>(this.url + this.makeUrl, options);
  }

  getModels(categoryID: number, makeID: number): Observable<Model[]> {
    const options = {params: new HttpParams()
        .set(this.apiKey, this.RIA_API_KEY)
        .append(this.categoryKey, categoryID.toString())
        .append(this.makeKey, makeID.toString())};
    return this.http.get<Model[]>(this.url + this.modelUrl, options);
  }

  getGenerations(modelID: number): Observable<Generation[]> {
    const options = {params: new HttpParams()
        .set(this.apiKey, this.RIA_API_KEY)
        .append(this.modelKey, modelID.toString())};
    return this.http.get<Generation[]>(this.url + this.generationUrl, options);
  }

  getGenerationBodyStyles(generationID: number): Observable<GenerationBodyStyle[]> {
    const options = {params: new HttpParams()
        .set(this.apiKey, this.RIA_API_KEY)
        .append(this.generationKey, generationID.toString())};
    return this.http.get<GenerationBodyStyle[]>(this.url + this.generationBodyStyleUrl, options);
  }

  getModifications(generationBodystyleID: number): Observable<Modification[]> {
    const options = {params: new HttpParams()
        .set(this.apiKey, this.RIA_API_KEY)
        .append(this.generationBodyStyleKey, generationBodystyleID.toString())};
    return this.http.get<Modification[]>(this.url + this.modificationUrl, options);
  }

  getEquips(modificationID: number): Observable<Equip[]> {
    const options = {params: new HttpParams()
        .set(this.apiKey, this.RIA_API_KEY)
        .append(this.modificationKey, modificationID.toString())};
    return this.http.get<Equip[]>(this.url + this.equipUrl, options);
  }
}
