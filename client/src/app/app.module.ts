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
import { AlertComponent } from './directives';
// import { AuthGuard } from './_guards';
// import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { UserService } from './service/user.service';
import { AlertService } from './service/alert.service';
import { AuthenticationService } from './service/authentication.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import {MatSidenav} from '@angular/material/sidenav';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SidebarFunctionsDrawComponent } from './sidebar-functions-draw/sidebar-functions-draw.component';
import { HomeComponent } from './components/admin/home/home.component';
import { UpdateComponent } from './components/admin/update/update.component';
import { NewComponent } from './components/admin/new/new.component';
import { DeleteComponent } from './components/admin/delete/delete.component';
// import { InterfacesComponent } from './components/admin/interfaces/interfaces.component';








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
    AlertComponent,
    SidebarComponent,
    SidebarFunctionsDrawComponent,
    HomeComponent,
    UpdateComponent,
    NewComponent,
    DeleteComponent,
    // InterfacesComponent,
    // MatSidenavModule,
    // MatSliderModule,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatIconModule,
    FormsModule,
    MatSliderModule,
    MatSidenavModule,
    ReactiveFormsModule,
    ButtonsModule
  ],
  providers: [
    AlertService,
        AuthenticationService,
        UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
