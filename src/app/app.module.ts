import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';

import { AppComponent } from './app.component';
import {environment} from '../environments/environment';
import { CarComponent } from './components/cars/car/car.component';
import { CarsComponent } from './components/cars/cars.component';
import { CarListComponent } from './components/cars/car-list/car-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    CarsComponent,
    CarListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
