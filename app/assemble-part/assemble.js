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
                $http.get(filename).success(function (data) {
                    plan = data;
                    window.console.log("Plan data was loaded successfully.");
                });
            }
        };
    }]);

    // define controller for assemble
    angular.module('TheApp').controller('assembleController', ['assembleService', 'schemasService', 'propertiesService', 'mastersService', function (assembleService, schemasService, propertiesService, mastersService) {
        //
        this.planActive = null;
        this.bandActive = null;
        this.componentActive = null;
        this.featureActive = null;
        this.attributeActive = null;
        this.planStored = null;
        this.bandStored = null;
        this.componentStored = null;
        this.featureStored = null;
        this.attributeStored = null;
        this.copy = function (object) {
            return angular.copy(object);
        };
        //
        //this.newPlan();
        this.newPlan = function () {
            var plan = schemasService.planFresh();
            plan.name = "New Plan";
            plan.description = "Description for the new plan";
            assembleService.setPlan(plan);
            this.editPlan(plan);
        };
        this.getPlan = function () {
            //window.alert("getPlan() called");
            return assembleService.getPlan();
        };
        this.editPlan = function (plan) {
            propertiesService.manage(schemasService.planSchema(), plan, "Bands");
        };
        this.activatePlan = function (plan) {
            this.planActive = plan;
            this.editPlan(plan);
        };
        this.loadPlan = function () {
            assembleService.loadPlan('data/plan-A.json');
        };
        this.savePlan = function (plan) {
            return true;
        };
        this.addBand = function (plan) {
            if (!plan) {
                this.newPlan();
                plan = this.getPlan();
            }
            var band = schemasService.bandFresh();
            band.name = "New Band";
            band.description = "Description for the new band";
            plan.Bands.push(band);
            this.editBand(band);
            return band;
        };
        this.editBand = function (band) {
            propertiesService.manage(schemasService.bandSchema(), band, "Components");
        };
        this.activateBand = function (band) {
            this.bandActive = band;
            this.editBand(band);
        };
        this.addComponent = function (band) {
            if (!band) {
                band = this.addBand();
            }
            var component = schemasService.componentFresh();
            component.name = "New Component";
            component.description = "Description for the new component";
            band.Components.push(component);
            this.editComponent(component);
            return component;
        };
        this.editComponent = function (component) {
            propertiesService.manage(schemasService.componentSchema(), component, "Features");
        };
        this.activateComponent = function (component) {
            this.componentActive = component;
            this.editComponent(component);
        };
        this.editFeature = function (feature) {
            var master = mastersService.getMasterFromPath(feature.masterPath);
            propertiesService.manage(master.Attributes, feature, "Attributes");
        };
        this.activateFeature = function (feature) {
            this.featureActive = feature;
            this.editFeature(feature);
        };
        this.getMasterName = function (feature) {
            return feature.masterPath.split(">")[2];
        };
        //
        this.dropIntoComponent = function (event, index, item, external, type, allowedTypes) {
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