// silence JSLint error: variable used before it was defined
/*global angular*/



(function (angular) {
    'use strict';

    // define service for manufacture
    angular.module('TheApp').factory('manufactureService', ['mastersService', function (mastersService) {
        var masterEdit = null;
        //
        return {
            "setMasterEdit": function (master) {
                masterEdit = angular.copy(master);
            },
            "getMasterEdit": function () {
                if (!angular.equals(masterEdit, mastersService.getSelected())) {
                    this.setMasterEdit(mastersService.getSelected());
                }
                return masterEdit;
            },
            "isMasterDirty": function () {
                return angular.equals(mastersService.getSelected(), masterEdit);
            }
        };
    }]);

    // define controller for navigation
    angular.module('TheApp').controller('manufactureController', ['manufactureService', 'schemasService', 'propertiesService', function (manufactureService, schemasService, propertiesService) {
        // Model to JSON for demo purpose
        /*$scope.$watch('models', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);*/
        //
        //this.masters = mastersService;
        //this.properties = propertiesService;
        //
        //this.masterEdit = null;
        this.getEditMaster = function () {
            return manufactureService.getMasterEdit();
        };
        this.selectMaster = function () {
            this.editMaster(manufactureService.getMasterEdit());
        };
        this.newMaster = function () {
            manufactureService.setMasterEdit(schemasService.masterFresh());
            this.editMaster(manufactureService.getMasterEdit());
        };
        this.editMaster = function (master) {
            propertiesService.manage(schemasService.masterSchema(), master, "Attributes"); //window.alert(JSON.stringify(propertiesService.get()));
        };
        this.addAttribute = function () {
            var attribute = schemasService.attributeFresh();
            manufactureService.getMasterEdit().Attributes.properties.push(attribute);
            this.editAttribute(attribute);
        };
        this.editAttribute = function (attribute) {
            propertiesService.manage(schemasService.attributeSchema(), attribute, "value"); //window.alert(JSON.stringify(propertiesService.get()));
        };
        this.isMasterDirty = function () {
            return manufactureService.isMasterDirty();
        };
        this.isEditingMaster = function () {
            return true; //this.masterEdit !== null;
        };
    }]);

}(window.angular));