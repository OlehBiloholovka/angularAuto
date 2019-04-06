import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Car } from './car.model';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AuthService} from '../../../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  carList: AngularFireList<any>;
  selectedCar: Car = new Car();
  uploadPercent: Observable<number>;
  photoURLs: Observable<string>;

  constructor(private firebase: AngularFireDatabase, private storage: AngularFireStorage, private authService: AuthService) { }

  getData() {
    this.carList = this.firebase.list('cars');
    return this.carList;
  }

  insertCar(car: Car) {
    this.carList.push({
      userID: car.userID,
      name: car.name,
      model: car.model,
      year: car.year,
      engine: car.engine,
      engineType: car.engineType,
      mileage: car.mileage,
      price: car.price,
      photoURLs: car.photoURLs
      // options: car.options
    });
  }

  updateCar(car: Car) {
     this.carList.update(car.$key,
       {
         userID: car.userID,
         name: car.name,
         model: car.model,
         year: car.year,
         engine: car.engine,
         engineType: car.engineType,
         mileage: car.mileage,
         price: car.price,
         photoURLs: car.photoURLs
         // options: car.options
     });
  }

  deleteCar($key: string) {
    this.carList.remove($key);
  }

  uploadPhoto(event) {
    const file = event.target.files[0];
    const filePath = 'temp/' + this.authService.user.uid + '/' + Date.now() + '.jpg';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        // this.photoURL = fileRef.getDownloadURL();
        // this.selectedCar.photoURLs.push(fileRef.getDownloadURL().toString());
        this.photoURLs = fileRef.getDownloadURL();

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
