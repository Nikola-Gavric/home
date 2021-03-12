
require('bootstrap-additions/dist/modules/popover.css');
require('angular-strap/dist/modules/compiler');
require('angular-strap/dist/modules/dimensions');
require('angular-strap/dist/modules/tooltip');
require('angular-strap/dist/modules/popover');
require('angular-mass-autocomplete');
function requireAll(r) {
    r.keys().forEach(r);
}

angular.module('glook.travelPayoutsSearchComponent', [
    require('angular-sanitize'),
    require('angular-bootstrap-datetimepicker'),
    'mgcrea.ngStrap.core',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.popover',
    'MassAutoComplete'
]).run(['$templateCache', function ($templateCache) {
    //override datepicker template
    $templateCache.put('templates/datetimepicker.html', require('./templates/datepicker.html'));
}]).config(function (massAutocompleteConfigProvider) {
    //override default position of autocomplete suggestions
    massAutocompleteConfigProvider.position_autocomplete = function (container, target) {
        var rect = target[0].getBoundingClientRect();
        container[0].style.width = rect.width + 'px';
    }
});

requireAll(require.context('./factories/', true, /\.js$/));
requireAll(require.context('./components/', true, /\.js$/));
requireAll(require.context('./directives/', true, /\.js$/));

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
     
    if (script.readyState) { //IE
    script.onreadystatechange = function () {
    if (script.readyState == "loaded" || script.readyState == "complete") {
    script.onreadystatechange = null;
    callback();
    }
    };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
     
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    }
     
loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function () { });

module.exports = 'glook.travelPayoutsSearchComponent';