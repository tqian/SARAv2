
import './polyfills.ts';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  // Express Engine
// export {ngExpressEngine} from '@nguniversal/express-engine';

// Import module map for lazy loading
export {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
