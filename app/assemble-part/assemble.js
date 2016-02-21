// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    // define service for assemble
    angular.module('TheApp').factory('assembleService', ['$http', '$mdBottomSheet', 'plansService', function ($http, $mdBottomSheet, plansService) {
        var planEdit,
            planEditOriginal,
            toggleEditSelectedPlan = true;

        function isSamePlan(planA, planB) {
            return planA && planB && planA.name === planB.name && planA.collectionName === planB.collectionName && planA.groupName === planB.groupName;
        }

        return {
            "getPlanEdit": function () {
                var planSelected = plansService.getSelected();
                if (planSelected && !isSamePlan(planSelected, planEdit) && toggleEditSelectedPlan && !this.isPlanDirty()) { // if (!angular.equals(planEdit, plansService.getSelected())) {
                    this.setPlanEdit(planSelected);
                }
                return planEdit;
            },
            "setPlanEdit": function (plan) {
                planEdit = angular.copy(plan);
                planEditOriginal = angular.copy(planEdit);
            },
            "revertPlanEdit": function () {
                planEdit = angular.copy(planEditOriginal);
            },
            "savePlanEdit": function (replaceOriginal) {
                var planSave = angular.copy(planEdit);
                delete planSave.reference;
                angular.forEach(planSave.Attributes.properties, function (property, key) {
                    if (property.mandatory && planSave.Attributes.required.indexOf(key) < 0) {
                        if (!planSave.Attributes.required) {
                            planSave.Attributes.required = [];
                        }
                        planSave.Attributes.required.push(key);
                    }
                    delete property.mandatory;
                });
                plansService.add(planSave, replaceOriginal ? planEditOriginal : undefined);
                planEditOriginal = angular.copy(planEdit);
            },
            "isPlanDirty": function () {
                return !angular.equals(planEdit, planEditOriginal);
            },
            "deletePlan": function () {
                plansService.remove(planEdit);
                planEdit = null;
                planEditOriginal = null;
            }
        };
    }]);

    // define controller for assemble
    angular.module('TheApp').controller('assembleController', ['$scope', '$mdDialog', 'assembleService', 'schemasService', 'propertiesService', 'mastersService', function ($scope, $mdDialog, assembleService, schemasService, propertiesService, mastersService) {
        //
        var self = this;
        self.autoEditSelectedPlan = false;
        self.editSelectedPlan = function (toggle) {
            assembleService.editSelectedPlan(toggle);
        };
        self.getPlan = function () {
            return assembleService.getPlanEdit();
        };
        self.selectPlan = function () {
            self.editPlan(assembleService.getPlanEdit());
        };
        self.editPlan = function (plan) {
            propertiesService.manage(schemasService.schema('plan'), plan, ["Attributes"]); //window.alert(JSON.stringify(propertiesService.get()));
        };
        self.newPlan = function (ev) {
            var confirm, planNew;
            if (assembleService.isPlanDirty()) {
                confirm = $mdDialog.confirm()
                    .title('Save Plan Changes?')
                    .textContent('Do you want to save changes made to "' + assembleService.getPlanEdit().name + '" plan?')
                    .ariaLabel('Save Plan Changes')
                    .targetEvent(ev)
                    .ok('Save')
                    .cancel('Discard');
                $mdDialog.show(confirm).then(function () {
                    self.savePlan(ev);
                }, function () {});
            }
            self.autoEditSelectedPlan = false;
            assembleService.editSelectedPlan(self.autoEditSelectedPlan);
            planNew = schemasService.fresh('plan');
            planNew.name = "New Plan";
            assembleService.setPlanEdit(planNew);
            self.editPlan(assembleService.getPlanEdit());
        };
        self.revertPlan = function () {
            assembleService.revertPlanEdit();
        };
        self.savePlan = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Modify Existing Plan?')
                .textContent('Do you want to modify existing plan or create new one?')
                .ariaLabel('Modify Existing Plan')
                .targetEvent(ev)
                .ok('Modify Existing')
                .cancel('Create New');
            $mdDialog.show(confirm).then(function () {
                assembleService.savePlanEdit(true);
            }, function () {
                assembleService.savePlanEdit(false);
            });
        };

        self.planActive = null;
        self.bandActive = null;
        self.flavorActive = null;
        self.featureActive = null;
        self.attributeActive = null;
        self.planCopied = null;
        self.bandCopied = null;
        self.flavorCopied = null;
        self.featureCopied = null;
        self.attributeCopied = null;
        self.copy = function (object) {
            return angular.copy(object);
        };
        //
        self.getPlan = function () {
            //window.alert("getPlan() called");
            return assembleService.getPlanEdit();
        };
        self.editPlan = function (plan) {
            propertiesService.manage(schemasService.schema('plan'), plan, ["Bands"]);
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
            propertiesService.manage(schemasService.schema('band'), band, ["Flavors"]);
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
            propertiesService.manage(schemasService.schema('flavor'), flavor, ["Features"]);
        };
        self.activateFlavor = function (flavor) {
            self.flavorActive = flavor;
            self.editFlavor(flavor);
        };
        self.editFeature = function (feature) {
            var master = mastersService.getMasterFromPath(feature.masterPath);
            propertiesService.manage(master.Attributes, feature, ["Attributes"]);
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
            //console.log(JSON.stringify(event) + '\n' + JSON.stringify(index) + '\n' + JSON.stringify(item) + '\n' + JSON.stringify(external) + '\n' + JSON.stringify(type) + '\n' + JSON.stringify(allowedType));
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