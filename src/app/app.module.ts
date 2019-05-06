import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import {environment} from '../environments/environment';
import { CarComponent } from './components/cars/car/car.component';
import { CarsComponent } from './components/cars/cars.component';
import { CarListComponent } from './components/cars/car-list/car-list.component';
import { HeaderComponent } from './components/header/header.component';
import { UserLoginComponent } from './components/users/user-login/user-login.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import {AuthService} from './core/auth.service';
import { AngularFireStorageModule} from '@angular/fire/storage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CarFormComponent } from './user/car-form/car-form.component';
import {HttpClientModule} from '@angular/common/http';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { UserComponent } from './user/user.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { RiaComponent } from './components/ria/ria.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/cars', pathMatch: 'full'},
  {path: 'old', component: CarsComponent},
  {path: 'cars', component: CarListComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'car', component: CarComponent},
  {path: 'user', component: UserComponent, children: [
      {path: 'form', component: CarFormComponent},
      {path: ':id/cars', component: CarListComponent},
      {path: 'profile', component: UserProfileComponent}
    ]},

];

@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    CarsComponent,
    CarListComponent,
    HeaderComponent,
    UserLoginComponent,
    UserProfileComponent,
    CarFormComponent,
    CheckboxGroupComponent,
    SidebarComponent,
    UserComponent,
    RiaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
