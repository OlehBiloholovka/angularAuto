import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { Car } from './car.model';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private photoUrlBehaviorSubject: BehaviorSubject<string>;
  private currentCarBehaviorSubject: BehaviorSubject<Car>;
  private currentCar: Car;

  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage,
              public afAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore) {
    this.photoUrlBehaviorSubject = new BehaviorSubject<string>(this.getDefaultUrl());
    this.currentCarBehaviorSubject = new BehaviorSubject<Car>(new Car());
    this.currentCar = this.currentCarBehaviorSubject.value;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userID = user.uid;
      }
    });
  }
  carList: AngularFireList<Car>;
  uploadPercent: Observable<number>;

  private basePath = '/cars';

  // new db
  private carsPath = '/cars';
  carCollection: AngularFirestoreCollection<Car>;

  car: AngularFireObject<Car> = null;
  userID: string;

  private static handleError(error: any) {
    console.log(error);
  }

  getAllCarsNEW(): AngularFirestoreCollection<Car> {
    this.carCollection = this.angularFirestore.collection<Car>(this.carsPath);
    return this.carCollection;
  }

  createCarNEW(car: Car): void {
    car.userID = this.userID;
    this.carCollection.add(car)
      .catch(error => CarService.handleError(error));
  }

  getAllCars(): AngularFireList<Car> {
    this.carList = this.db.list<Car>(this.basePath);
    return this.carList;
  }

  getCarsByUserID(userID: string): AngularFireList<Car> {
    this.carList =  this.db.list<Car>(this.basePath, ref => ref.orderByChild('userID').equalTo(userID));
    return this.carList;
  }

  getCar(key: string): AngularFireObject<Car> {
    const itemPath = `${this.basePath}/${key}`;
    this.car = this.db.object<Car>(itemPath);
    return this.car;
  }

  createCar(car: Car): void {
    car.userID = this.userID;
    car.photoURLs = this.currentCar.photoURLs;
    this.carList.push(car)
      .catch(error => CarService.handleError(error));
    // return this.car.valueChanges().;
  }

  updateCar(key: string, value: any): void {
    this.carList.update(key, value)
      .catch(CarService.handleError);
  }

  deleteCar(key: string): void {
    this.carList.remove(key)
      .catch(error => CarService.handleError(error));
  }

  deleteAll(): void {
    this.carList.remove()
      .catch(error => CarService.handleError(error));
  }

  uploadPhoto(event) {
    const file = event.target.files[0];
    const filePath = 'temp/' + this.userID + '/' + Date.now() + '.jpg';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {

        fileRef.getDownloadURL().subscribe((url) => {
          this.setPhotoUrl(url);
          // this.currentCarBehaviorSubject.value.photoURLs
          if (this.currentCarBehaviorSubject.value.photoURLs === undefined) {
            this.currentCarBehaviorSubject.value.photoURLs = [];
          } else {
            this.currentCarBehaviorSubject.value.photoURLs = Object.values(this.currentCar.photoURLs);
          }
          this.currentCarBehaviorSubject.value.photoURLs.unshift(url);
          this.currentCar.photoURLs = this.currentCarBehaviorSubject.value.photoURLs;
          this.uploadPercent = undefined;
          // if (this.currentCar.photoURLs === undefined) {
          //   this.currentCar.photoURLs = [];
          // } else {
          //   this.currentCar.photoURLs = Object.values(this.currentCar.photoURLs);
          // }
          // this.currentCar.photoURLs.unshift(url);
        });
      } )
    ).subscribe();
  }

  getCurrentCar(): Observable<Car> {
    return this.currentCarBehaviorSubject.asObservable();
  }
  setCurrentCar(newCar?: Car): void {
    if (!newCar) {
      newCar = new Car();
    }
    this.currentCarBehaviorSubject.next(newCar);
  }
  getPhotoUrl(): Observable<string> {
    return this.photoUrlBehaviorSubject.asObservable();
  }
  setPhotoUrl(newUrl?: string): void {
    if (!newUrl) {
      newUrl = this.getDefaultUrl();
    }
    this.photoUrlBehaviorSubject.next(newUrl);
  }

  private getDefaultUrl(): string {
    return 'https://firebasestorage.googleapis.com/v0/b/angularauto.appspot.com/o/carThumbnail%2F13-car-integratedpieces.png'
      + '?alt=media&token=fb15f0f7-19c7-4340-8832-5b221400a826';
  }

  // get isNewCar(): boolean {
  //   return this.currentCar.key === undefined;
  // }
}
