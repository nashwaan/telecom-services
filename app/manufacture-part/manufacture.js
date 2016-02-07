// silence JSLint error: variable used before it was defined
/*global angular*/



(function (angular) {
    'use strict';

    // define service for manufacture
    angular.module('TheApp').factory('manufactureService', ['mastersService', function (mastersService) {
        var masterEdit,
            masterEditOriginal,
            toggleEditSelectedMaster = false;

        function propertiesToItems(master) {
            master.Attributes.items = [];
            var key;
            for (key in master.Attributes.properties) {
                if (master.Attributes.properties.hasOwnProperty(key)) {
                    master.Attributes.items.push(master.Attributes.properties[key]);
                    master.Attributes.items[master.Attributes.items.length - 1].property = key;
                }
            }
            master.Attributes.type = "array";
            delete master.Attributes.properties;
            return master;
        }

        function itemsToProperties(master) {
            master.Attributes.properties = {};
            var i, key;
            for (i = 0; i < master.Attributes.items.length; i += 1) {
                key = master.Attributes.items[i].property;
                master.Attributes.properties[key] = master.Attributes.items[i];
                master.Attributes.properties[key].sortKey = i + 1;
                delete master.Attributes.properties[key].property;
            }
            master.Attributes.type = "object";
            delete master.Attributes.items;
            return master;
        }

        function isSameMaster(masterA, masterB) {
            return masterA && masterB && masterA.name === masterB.name && masterA.collectionName === masterB.collectionName && masterA.groupName === masterB.groupName;
        }

        return {
            "getMasterEdit": function () {
                var masterSelected = mastersService.getSelected();
                if (masterSelected && !isSameMaster(masterSelected, masterEdit) && toggleEditSelectedMaster && !this.isMasterDirty()) { // if (!angular.equals(masterEdit, mastersService.getSelected())) {
                    this.setMasterEdit(masterSelected);
                }
                return masterEdit;
            },
            "setMasterEdit": function (master) {
                masterEdit = angular.copy(master);
                propertiesToItems(masterEdit);
                masterEditOriginal = angular.copy(masterEdit);
            },
            "revertMasterEdit": function () {
                masterEdit = angular.copy(masterEditOriginal);
            },
            "saveMasterEdit": function (replaceOriginal) {
                var masterSave = angular.copy(masterEdit);
                itemsToProperties(masterSave);
                delete masterSave.reference;
                mastersService.add(masterSave, replaceOriginal ? masterEditOriginal : undefined);
                masterEditOriginal = angular.copy(masterEdit);
            },
            "isMasterDirty": function () {
                return !angular.equals(masterEdit, masterEditOriginal);
            },
            "deleteMaster": function () {
                mastersService.remove(masterEdit);
                masterEdit = null;
                masterEditOriginal = null;
            },
            "editSelectedMaster": function (toggle) {
                toggleEditSelectedMaster = toggle;
            }
        };
    }]);

    // define controller for navigation
    angular.module('TheApp').controller('manufactureController', ['$mdDialog', 'manufactureService', 'schemasService', 'propertiesService', function ($mdDialog, manufactureService, schemasService, propertiesService) {
        // manual watch a model
        /*$scope.$watch('models', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);*/
        var self = this;
        self.autoEditSelectedMaster = false;
        self.editSelectedMaster = function (toggle) {
            manufactureService.editSelectedMaster(toggle);
        };
        self.getEditMaster = function () {
            return manufactureService.getMasterEdit();
        };
        self.selectMaster = function () {
            self.editMaster(manufactureService.getMasterEdit());
        };
        self.editMaster = function (master) {
            propertiesService.manage(schemasService.schema('master'), master, ["Attributes"]); //window.alert(JSON.stringify(propertiesService.get()));
        };
        self.newMaster = function (ev) {
            var confirm, masterNew;
            if (manufactureService.isMasterDirty()) {
                confirm = $mdDialog.confirm()
                    .title('Save Master Changes?')
                    .textContent('Do you want to save changes made to "' + manufactureService.getMasterEdit().name + '" master?')
                    .ariaLabel('Save Master Changes')
                    .targetEvent(ev)
                    .ok('Save')
                    .cancel('Discard');
                $mdDialog.show(confirm).then(function () {
                    self.saveMaster(ev);
                }, function () {});
            }
            self.autoEditSelectedMaster = false;
            manufactureService.editSelectedMaster(self.autoEditSelectedMaster);
            masterNew = schemasService.fresh('master');
            masterNew.Attributes.properties = {
                "attribute": schemasService.fresh('attribute')
            };
            manufactureService.setMasterEdit(masterNew);
            self.editMaster(manufactureService.getMasterEdit());
        };
        self.newMaster();
        self.revertMaster = function () {
            manufactureService.revertMasterEdit();
        };
        self.saveMaster = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Modify Existing Master?')
                .textContent('Do you want to modify existing master or create new one?')
                .ariaLabel('Modify Existing Master')
                .targetEvent(ev)
                .ok('Modify Existing')
                .cancel('Create New');
            $mdDialog.show(confirm).then(function () {
                manufactureService.saveMasterEdit(true);
            }, function () {
                manufactureService.saveMasterEdit(false);
            });
        };
        self.addAttribute = function () {
            var attribute = schemasService.fresh('attribute');
            manufactureService.getMasterEdit().Attributes.items.push(attribute);
            self.editAttribute(attribute);
        };
        self.editAttribute = function (attribute) {
            propertiesService.manage(schemasService.schema('attribute'), attribute, ["value", "sortKey"]); //window.alert(JSON.stringify(propertiesService.get()));
        };
        self.isMasterDirty = function () {
            return manufactureService.isMasterDirty();
        };
        self.isEditingMaster = function () {
            return true; // self.masterEdit !== null;
        };
        self.deleteMaster = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Delete Master?')
                .textContent('Are you sure you want to delete "' + manufactureService.getMasterEdit().name + '" master?')
                .ariaLabel('Delete Master')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                manufactureService.deleteMaster();
            }, function () {});
        };
        self.deleteAttribute = function (ev, attribute, index) {
            var confirm = $mdDialog.confirm()
                .title('Delete Attribute?')
                .textContent('Are you sure you want to delete "' + attribute.title + '" attribute?')
                .ariaLabel('Delete Attribute')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                manufactureService.getMasterEdit().Attributes.items.splice(index, 1);
            }, function () {});
        };
    }]);

}(window.angular));