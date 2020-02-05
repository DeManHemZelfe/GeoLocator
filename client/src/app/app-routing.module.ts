import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { LossekaartComponent } from './lossekaart/lossekaart.component';
import { AuthGuard } from './auth/auth.guard';
import { TodoComponent } from './_Todo_/todo.component';
import { KaartviewerComponent } from './kaartviewer/kaartviewer.component';
import { ToolbarFunctionsComponent } from './functions/toolbar-functions/toolbar-functions.component';
import { SidebarComponent } from './pdokmap/sidebar.component';
import { LayerbuttonComponent } from './functions/buttons-functions/layerbutton/layerbutton.component';
import { TpComponent } from './testmap/testpage/tp/tp.component';
import { MobileComponent } from './device/mobile/pages/components/mobile/mobile.component';
import { Kaartviewer3dComponent } from './kaartviewer3d/kaartviewer3d/kaartviewer3d.component';


const routes: Routes = [
  { path: 'login', component:  LoginComponent }, // DIT WORD DE LOGIN \\
  { path: '', component:  IndexComponent, canActivate: [AuthGuard] }, // DIT WORD VERWIJDERD \\
  { path: 'kaartviewer', component:  KaartviewerComponent }, // DIT WORD DE LOGIN \\
  { path: 'mobileviewer', component:  MobileComponent }, // DIT WORD DE LOGIN \\
  { path: '3dviewer', component:  Kaartviewer3dComponent }, // DIT WORD DE LOGIN \\
  { path: 'toolbar', component:  ToolbarFunctionsComponent }, // DIT WORD DE LOGIN TOOLBAR\\
  { path: 'lossekaart', component: LossekaartComponent }, // DEZE KAART GAAT VERWIJDERD WORDEN \\
  { path: 'todo', component: TodoComponent }, // DIT IS DE TODO \\
  { path: 'tp', component: TpComponent }, // DIT IS DE TODO \\

  // DEZE WORDEN VERWIJDERD MAAR ZIJN NU HANDIG OM TE TESTEN OF ALLES HET WEL DOET
  { path: 'pdok', component: SidebarComponent }, // DIT IS DE UNDO EN REDO \\
  { path: 'buttonlayer', component: LayerbuttonComponent},
  // DEZE WORDEN VERWIJDERD MAAR ZIJN NU HANDIG OM TE TESTEN OF ALLES HET WEL DOETS
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
