import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// declare var Cesium: { buildModuleUrl: { setBaseUrl: (arg0: string) => void; }; };
// declare var Cesium;
// tslint:disable-next-line: no-string-literal
window['CESIUM_BASE_URL'] = '/assets/cesium'; // If youre using Cesium version < 1.42.0 add this line
// Cesium.buildModuleUrl.setBaseUrl('/assets/cesium/'); // If youre using Cesium version >= 1.42.0 add this line
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
