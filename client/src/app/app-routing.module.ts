import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { SidebarComponent } from './pdokmap/sidebar.component';
import {HeaderComponent } from './pages/header/header.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AppComponent } from './app.component';
import { LossekaartComponent } from './lossekaart/lossekaart.component';
import { AuthGuard } from './auth/auth.guard';
import { TodoComponent } from './_Todo_/todo.component';


// import { from } from 'rxjs';
// import { MapViewGridComponent } from './components/map-view-open-street/map-view-open-street.component';

const routes: Routes = [
  // { path: 'index', component: IndexComponent },
  { path: '', component:  IndexComponent, canActivate: [AuthGuard] },
  { path: 'login', component:  LoginComponent },
  // { path: 'map-view',  component:   MapViewComponent },
  // { path: 'sidebar', component: SidebarComponent },
  { path: 'lossekaart', component: LossekaartComponent },
  { path: 'todo', component: TodoComponent },
  // { path: 'app', component: AppComponent}
  // { path: '', component: IndexComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'login-form', component: LoginFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
