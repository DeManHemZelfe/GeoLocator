import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { LossekaartComponent } from './lossekaart/lossekaart.component';
import { AuthGuard } from './auth/auth.guard';
import { TodoComponent } from './_Todo_/todo.component';
import { KaartviewerComponent } from './kaartviewer/kaartviewer.component';
import { ToolbarFunctionsComponent } from './functions/toolbar-functions/toolbar-functions.component';
import { UndoRedoComponent } from './functions/undo.redo-functions/undo.redo';
import { SidebarComponent } from './pdokmap/sidebar.component';


const routes: Routes = [
  { path: 'login', component:  LoginComponent }, // DIT WORD DE LOGIN \\
  { path: '', component:  IndexComponent, canActivate: [AuthGuard] }, // DIT WORD VERWIJDERD \\
  { path: 'kaartviewer', component:  KaartviewerComponent }, // DIT WORD DE LOGIN \\
  { path: 'toolbar', component:  ToolbarFunctionsComponent }, // DIT WORD DE LOGIN TOOLBAR\\
  { path: 'lossekaart', component: LossekaartComponent }, // DEZE KAART GAAT VERWIJDERD WORDEN \\
  { path: 'todo', component: TodoComponent }, // DIT IS DE TODO \\
  { path: 'undo', component: UndoRedoComponent }, // DIT IS DE UNDO EN REDO \\

  { path: 'pdok', component: SidebarComponent }, // DIT IS DE UNDO EN REDO \\
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
