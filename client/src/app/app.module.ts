import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule,  Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MapViewOpenStreetComponent } from './components/map-view-open-street/map-view-open-street.component';
import { SearchingComponent } from './components/searching/searching.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomepageComponent } from './components/homepage/homepage.component';
import {MatIconModule} from '@angular/material/icon';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';






@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    HeaderComponent,
    FooterComponent,
    LoginpageComponent,
    MapViewOpenStreetComponent,
    SearchingComponent,
    HomepageComponent,
    RegistrationpageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
