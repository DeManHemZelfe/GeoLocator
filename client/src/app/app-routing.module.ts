import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { MapViewOpenStreetComponent } from './components/map-view-open-street/map-view-open-street.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';
// import { MapViewGridComponent } from './components/map-view-open-street/map-view-open-street.component';

const routes: Routes = [
  { path: '', component: LoginpageComponent },
  { path: 'loginpage', component: LoginpageComponent },
  { path: 'registrationpage',  component: RegistrationpageComponent },
  { path: 'map-view',  component:   MapViewComponent },
  { path: 'map-view-open-street',  component:   MapViewOpenStreetComponent },

  // { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
