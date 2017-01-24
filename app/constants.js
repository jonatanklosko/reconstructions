import angular from 'angular';

const GOOGLE_API_KEY = 'AIzaSyAFt0BqrcGYOgIuQRzlLVJKfcssxY4flis';

export default angular
  .module('app.constants', [])
  .constant('URLSHORTENER_URL', `https://www.googleapis.com/urlshortener/v1/url?key=${GOOGLE_API_KEY}`)
  .name;
