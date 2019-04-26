import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { Car } from './car.model';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CarService {


  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage,
              public afAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userID = user.uid;
      }
    });
  }
  carList: AngularFireList<Car>;
  selectedCar: Car = new Car();
  uploadPercent: Observable<number>;
  photoUrl: Observable<string | null>;

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
    this.carList.push(car)
      .catch(error => CarService.handleError(error));
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
        this.photoUrl = fileRef.getDownloadURL();

        fileRef.getDownloadURL().subscribe((url) => {
          if (this.selectedCar.photoURLs === undefined) {
            this.selectedCar.photoURLs = [];
          } else {
            this.selectedCar.photoURLs = Object.values(this.selectedCar.photoURLs);
          }
          this.selectedCar.photoURLs.unshift(url);
        });
      } )
    )
      .subscribe();
  }
}
