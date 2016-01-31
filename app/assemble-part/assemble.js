// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define service for assemble
    angular.module('TheApp').factory('assembleService', ['$http', '$mdBottomSheet', function ($http, $mdBottomSheet) {
        var plan = null;
        return {
            "setPlan": function (plan_given) {
                plan = plan_given;
            },
            "getPlan": function () {
                return plan;
            },
            "loadPlan": function (filename) {
                $http.get(filename).then(function (response) {
                    plan = response.data;
                    window.console.log("Plan data was loaded successfully.");
                }, function (response) {
                    window.console.warn("Could not load plan data." + response.status);
                });
            }
        };
    }]);

    // define controller for assemble
    angular.module('TheApp').controller('assembleController', ['$scope', '$timeout', 'assembleService', 'schemasService', 'propertiesService', 'mastersService', function ($scope, $timeout, assembleService, schemasService, propertiesService, mastersService) {
        //
        var self = this;
        self.planActive = null;
        self.bandActive = null;
        self.flavorActive = null;
        self.featureActive = null;
        self.attributeActive = null;
        self.planStored = null;
        self.bandStored = null;
        self.flavorStored = null;
        self.featureStored = null;
        self.attributeStored = null;
        self.copy = function (object) {
            return angular.copy(object);
        };
        //
        //self.newPlan();
        self.newPlan = function () {
            var plan = schemasService.fresh('plan');
            plan.name = "New Plan";
            plan.description = "Description for the new plan";
            assembleService.setPlan(plan);
            self.editPlan(plan);
        };
        self.getPlan = function () {
            //window.alert("getPlan() called");
            return assembleService.getPlan();
        };
        self.editPlan = function (plan) {
            propertiesService.manage(schemasService.schema('plan'), plan, "Bands");
        };
        self.activatePlan = function (plan) {
            self.planActive = plan;
            self.editPlan(plan);
        };
        self.loadPlan = function () {
            assembleService.loadPlan('data/plan-A.json');
        };
        self.savePlan = function (plan) {
            return true;
        };
        self.addBand = function (plan) {
            if (!plan) {
                self.newPlan();
                plan = self.getPlan();
            }
            var band = schemasService.fresh('band');
            band.name = "New Band";
            band.description = "Description for the new band";
            plan.Bands.push(band);
            self.editBand(band);
            return band;
        };
        self.editBand = function (band) {
            propertiesService.manage(schemasService.schema('band'), band, "Flavors");
        };
        self.activateBand = function (band) {
            self.bandActive = band;
            self.editBand(band);
        };
        self.addFlavor = function (band) {
            if (!band) {
                band = self.addBand();
            }
            var flavor = schemasService.fresh('flavor');
            flavor.name = "New Flavor";
            flavor.description = "Description for the new flavor";
            band.Flavors.push(flavor);
            self.editFlavor(flavor);
            return flavor;
        };
        self.editFlavor = function (flavor) {
            propertiesService.manage(schemasService.schema('flavor'), flavor, "Features");
        };
        self.activateFlavor = function (flavor) {
            self.flavorActive = flavor;
            self.editFlavor(flavor);
        };
        self.editFeature = function (feature) {
            var master = mastersService.getMasterFromPath(feature.masterPath);
            propertiesService.manage(master.Attributes, feature, "Attributes");
        };
        self.activateFeature = function (feature) {
            self.featureActive = feature;
            self.editFeature(feature);
        };
        self.getMasterName = function (feature) {
            return feature.masterPath.split(">")[2];
        };
        self.getMasterIcon = function (feature) {
            return mastersService.getMasterFromPath(feature.masterPath).icon;
        };
        //
        self.dropIntoFlavor = function (event, index, item, external, type, allowedTypes) {
            //window.console.log(JSON.stringify(event) + '\n' + JSON.stringify(index) + '\n' + JSON.stringify(item) + '\n' + JSON.stringify(external) + '\n' + JSON.stringify(type) + '\n' + JSON.stringify(allowedType));
            var feature, attribute;
            if (type === "feature") {
                feature = item;
            } else { // type === "master"
                feature = {};
                for (attribute in item.Attributes.properties) {
                    if (item.Attributes.properties.hasOwnProperty(attribute)) {
                        feature[attribute] = null;
                    }
                }
                feature.masterPath = item.groupName + ">" + item.collectionName + ">" + item.name;
            }
            return feature;
        };

    }]);

}(window.angular));