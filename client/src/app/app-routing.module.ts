import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { MapViewOpenStreetComponent } from './components/map-view-open-street/map-view-open-street.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SidebarFunctionsDrawComponent } from './sidebar-functions-draw/sidebar-functions-draw.component';
import { MapViewBingComponent } from './components/map-view-bing/map-view-bing.component';
// import { from } from 'rxjs';
// import { MapViewGridComponent } from './components/map-view-open-street/map-view-open-street.component';

const routes: Routes = [
  { path: '', component: LoginpageComponent },
  { path: 'homepage', component: HomepageComponent},
  { path: 'loginpage', component: LoginpageComponent },
  { path: 'registrationpage',  component: RegistrationpageComponent },
  { path: 'map-view',  component:   MapViewComponent },
  { path: 'map-view-open-street',  component:   MapViewOpenStreetComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'sidebar-functions-draw', component: SidebarFunctionsDrawComponent },
  { path: 'map-view-bing', component: MapViewBingComponent },
  // { path: 'options',  component:   OptionsComponent },

  // { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
