module.exports = (ngModule) => {
    const {NavigationBarDirective} = require('./navigation-bar');
    ngModule.directive('navigationBar', ($q, $compile) => new NavigationBarDirective($q, $compile));
};