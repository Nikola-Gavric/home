var pick = require('lodash/pick');

module.exports = angular.module('glook.travelPayoutsSearchComponent').component('searchForm', {
    templateUrl: '/templates/searchFormComponent.html',
    bindings: {
        formData: '=',
        searchUrl: '<',
        lang: '<',
        onSubmit: '&'
    },
    controller: function ($scope, translateFactory, $timeout, $filter) {
        var self = this;
        self.data = {};
        self.citys = {};
        self.citys[0] = 1;
        self.translate = function (input) {
            return $filter('translate')(input);
        };

        self.prepareData = function () {
            var data = angular.copy(self.data);
            angular.forEach(data, function (value, key) {
                // Transform cities
                if ((['origin', 'destination'].indexOf(key) !== -1) && typeof value === 'object') {
                    if (value.obj !== undefined && value.obj.code !== undefined) {
                        data[key] = value.obj.code;
                    } else {
                        data[key] = undefined;
                    }
                } else if ((['depart_date', 'return_date'].indexOf(key) !== -1) && value !== null) {
                    // Transform dates
                    data[key] = moment(value).format("YYYY-MM-DD");
                } else if (typeof value === 'number') {
                    // Any other values to string
                    data[key] = value.toString();
                }
            });
            return data;
        };

        self.submit = function () {
            self.formData = self.prepareData();
            $timeout(function () {
                self.onSubmit();
            }, 100);
        };

        self.$onInit = function () {
            translateFactory.setLocale(self.lang);
            self.data = angular.copy(self.formData);
            moment.locale(self.lang);
        };

        self.$onChanges = function (changes) {
            if (changes.searchUrl !== undefined) {
                self.data = angular.copy(self.formData);
                $scope.$broadcast('newSearch');
            }
            if (changes.lang !== undefined) {
                translateFactory.setLocale(changes.lang.currentValue);
                moment.locale(self.lang);
            }
        };

        self.show_flights = function (event) {
            var obj = document.getElementById("flights-to-multi");
            
            if(obj.innerHTML=='<div class="twidget-flights-link_to_simple">Back to simple route</div>'){
                obj.innerHTML = '<div class="twidget-flights-link_to_multi">Multi-city route</div>';
                $(".change-area").removeClass("multi-city-view");
                $(".change-area").addClass("twidget-tab-content");

                $('.simple-form').removeClass('hide-item');
                $('.multi-city-form').addClass('hide-item');
                
            }else{
                obj.innerHTML = '<div class="twidget-flights-link_to_simple">Back to simple route</div>';
                $(".change-area").addClass("multi-city-view");
                $(".change-area").removeClass("twidget-tab-content");

                $('.multi-city-form').removeClass('hide-item');
                $('.simple-form').addClass('hide-item');
            }
        }
        self.remove_multi_row = function (key) {
            var keys = Object.keys(self.citys);
            var len = keys.length;
            if(len<2) return;
            delete self.citys[key];
        }
        self.add_multi_row = function () {
            var keys = Object.keys(self.citys);
            var len = keys.length;
            self.citys[keys[len-1]+1] = self.citys[keys[len-1]]+1;
        }
    }
}).run(function ($templateCache) {
    $templateCache.put('/templates/searchFormComponent.html', require('../templates/searchFormComponent.html'));
});