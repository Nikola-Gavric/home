module.exports = angular.module('travelPayoutsApp').component('searchResultsItem', {
    templateUrl: './templates/components/searchResultsItem.html',
    bindings: {
        value: '<',
    },
    require: {
        parent: '^^searchResults'
    },
    controller: function ($element) {
        var self = this;
        var termsLenght = 0;
        self.isRetina = window.devicePixelRatio > 1;
        self.$onChanges = function () {
            self.gates = self.parent.gates;
            self.airports = self.parent.airports;
            self.searchId = self.parent.searchId;
            self.fligth = setFligts();
        };

        self.$doCheck = function () {
            if (Object.keys(self.value.terms).length !== termsLenght) {
                termsLenght = Object.keys(self.value.terms).length;
                self.prices = setPrices();
                self.agency_count = self.prices.length;
            }
        };

        function setPrices() {
            var result = [];
            angular.forEach(self.value.terms, function (value, id) {
                value.id = id;
                value.label = self.gates[id];

                value.flights_baggage_state = [];
                value.flights_baggage_state.state = false;
                value.flights_baggage_state.label = "Without Carry on";
                if(value.flights_baggage){
                    angular.forEach(value.flights_baggage, function(data, idx){
                        var item = "baggage";
                        var wgt = data[0]=="" ? "?" : parseInt(0+data[0].substr(3));
                        value.flights_baggage[idx].count = data[0]=="" ? 0 : parseInt(0+data[0]);
                        value.flights_baggage[idx].label = data[0]=="" ? "Unknown carry on" : value.flights_baggage[idx].count+" "+item+", up to "+wgt+"kg per person";
                        value.flights_baggage[idx].weight = wgt==0 ? "?" : wgt;
                    });
                    value.flights_baggage[0].state = true;
                    value.flights_baggage_state.state = true;
                    value.flights_baggage_state.label = value.flights_baggage[0].label;
                    value.flights_baggage_state.weight = value.flights_baggage[0].weight;
                } else {
                    value.flights_baggage = [];
                    value.flights_baggage[0].state = false;
                    value.flights_baggage[0].label = "Without Carry on"
                }

                value.flights_handbags_state = [];
                value.flights_handbags_state.state = false;
                value.flights_handbags_state.label = "Without luggage";
                if(value.flights_handbags){
                    angular.forEach(value.flights_handbags, function(data, idx){
                        var item = "luggage";
                        var wgt = data[0]=="" ? "?" : parseInt(0+data[0].substr(3));
                        value.flights_handbags[idx].count = data[0]=="" ? 0 : parseInt(0+data[0]);
                        value.flights_handbags[idx].label = data[0]=="" ? "Unknown "+item : value.flights_baggage[idx].count+" "+item+", up to "+wgt+"kg per person";
                        value.flights_handbags[idx].weight = wgt==0 ? "?" : wgt;
                    });
                    value.flights_handbags[0].state = true;
                    value.flights_handbags_state.state = true;
                    value.flights_handbags_state.label = value.flights_handbags[0].label;
                    value.flights_handbags_state.weight = value.flights_handbags[0].weight;
                } else {
                    value.flights_handbags = [];
                    value.flights_handbags[0].state = false;
                    value.flights_handbags[0].label = "Without luggage"
                }

                result.push(value);                
            });
            return result;
        };

        function setFligts() {
            var flights = angular.copy(self.value.segment);
            angular.forEach(flights, function (segment, direction) {
                angular.forEach(segment.flight, function (flight, flightKey) {
                    var segmentDirections = self.value.segments_airports[direction];
                    if (flight.departure === segmentDirections[0]) {
                        flight.direction_caption = direction==0?"Depart":"Return";
                        flight.direction = direction;
                        flights[direction].first = flight;
                    }
                    if (flight.arrival === segmentDirections[1]) {
                        flights[direction].last = flight;
                    }
                });
            });
            return flights;
        };
    }
}).filter('secondsToTime', function () {

    function padTime(t) {
        return t < 10 ? "0" + t : t;
    }

    return function (_seconds, format) {
        if (format === undefined) {
            format = '%hours%h %minutes%m';
        }
        if (typeof _seconds !== "number" || _seconds < 0)
            return "00:00:00";
        var hours = Math.floor(_seconds / 3600),
            minutes = Math.floor((_seconds % 3600) / 60);
        return format.replace(/%hours%/, padTime(hours)).replace(/%minutes%/, padTime(minutes));
    };
});
