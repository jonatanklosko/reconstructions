import '../app/app.js';
import 'angular-mocks';

/* Require all specs.
   See: https://github.com/webpack/karma-webpack#alternative-usage */
let specContext = require.context('.', true, /\.spec\.js/);
specContext.keys().forEach(specContext);
