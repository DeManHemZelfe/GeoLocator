
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import {MatMenuModule} from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './pdokmap/sidebar.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { IndexComponent } from './pages/index/index.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GroupService } from './services/group.service';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule,  Routes } from '@angular/router';
import {MatInputModule, MatOptionModule, MatSelectModule, MatButtonModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { MenusModule } from '@progress/kendo-angular-menu';
import { BagService } from './layers/bag.service';
import { BestuurlijkegrenzenService } from './layers/bestuurlijkegrenzen.service';
import {MatRadioModule} from '@angular/material/radio';
import { SpoorwegenService } from './layers/spoorwegen.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HeaderComponent } from './pages/header/header.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { LossekaartComponent } from './lossekaart/lossekaart.component';
import { TodoComponent} from './_Todo_/todo.component';
import {GeocoderModule} from 'angular-geocoder';
import { KaartviewerComponent } from './kaartviewer/kaartviewer.component';
import { ToolbarFunctionsComponent } from './functions/toolbar-functions/toolbar-functions.component';
import { ServiceService } from './pdokmap/pdokmapconfigmap/service.service';
import { BgService } from './pdokmap/layer/bg.service';
import { LayerbuttonComponent } from './functions/buttons-functions/layerbutton/layerbutton.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ToolbarComponent} from './pdokmap/toolbar/toolbar.component';
import { TpComponent } from './testmap/testpage/tp/tp.component';
import { MapconfigService } from './testmap/testpage/config/mapconfig/mapconfig.service';
import { LayerconfigService } from './testmap/testpage/config/layerconfig/layerconfig.service';
import {ToolbarTweeComponent} from './testmap/testpage/toolbar/toolbar.component';
import {DialogComponent} from './dialog/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';

// import {MatDialogModule} from '@angular/material/dialog';

import {DialogsModule, DialogModule,  DialogService,
  DialogRef,
  DialogCloseResult} from '@progress/kendo-angular-dialog';

import { PopupModule } from '@progress/kendo-angular-popup';
import {DragMenuComponent} from './kaart/layout/.ts/drag-menu/drag-menu';
import {DrawMenuComponent} from './kaart/layout/.ts/draw-menu/draw-menu';
import {MatTreeModule} from '@angular/material/tree';
import { LayoutModule } from '@progress/kendo-angular-layout';
import {TreeViewModule} from '@progress/kendo-angular-treeview';
import { MobileComponent } from './device/mobile/pages/components/mobile/mobile.component';
import { HomeComponent } from './pages/home/home/home.component';
import { GeosetComponent } from './kaart/layout/.ts/geoset-menu/geoset-menu';



export function tokenGetter() {
  return localStorage.getItem('JWT');
}

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    IndexComponent,
    LoginComponent,
    SidebarComponent,
    LoginFormComponent,
    HeaderComponent,
    LossekaartComponent,
    TodoComponent,
    KaartviewerComponent,
    ToolbarFunctionsComponent,
    LayerbuttonComponent,
    ToolbarComponent,
    ToolbarTweeComponent,
    TpComponent,
    DialogComponent,
    DragMenuComponent,
    DrawMenuComponent,
    MobileComponent,
    HomeComponent,
    GeosetComponent

  ],
  imports: [
    RouterModule,
    MatTreeModule,
    LayoutModule,
    DragDropModule,
    PopupModule,
    DialogsModule, ButtonsModule, DialogModule,
    GeocoderModule,
    ScrollingModule,
    BrowserModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatIconModule,
    MatSliderModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    DropDownsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatMenuModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MenusModule,
    TooltipModule,
    NgbModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/user/authenticate']
      }
    }),
    DialogsModule,
    TreeViewModule,
  ],

  providers: [
    UserService,
    GroupService,
    BagService,
    BestuurlijkegrenzenService,
    SpoorwegenService,
    ServiceService,
    BgService,
    MapconfigService,
    LayerconfigService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
