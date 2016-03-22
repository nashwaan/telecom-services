// silence JSLint error: variable used before it was defined
/*global angular*/
/*global JSZip,JSZipUtils*/
/*global xml2json,json2xml*/
/*global saveAs*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('writerService', ['$http', function ($http) {
        var template;
        function transformModel(plan) {
            var transform = angular.copy(plan);
            transform.Contributors = [
                {name: "Yousuf", title: "Sr Manager", section: "Automation", department: "IT"},
                {name: "Roshan", title: "Sr Manager", section: "Wireless", department: "MKT"},
                {name: "Philip", title: "Manager", section: "Wireless", department: "MKT"}
            ];
            (function setTotals(obj) {
                angular.forEach(obj, function (val, key) {
                    if (val instanceof Array) {
                        obj['total' + key] = val.length;
                        var i;
                        for (i = 0; i < val.length; i += 1) {
                            setTotals(val[i]);
                        }
                    } else if (typeof val === 'object') {
                        setTotals(val);
                    }
                });
            }(transform));
            return transform;
        }
        function findPlaceholders(node) {
            var i, placeholders = [];
            for (i = 0; i < node.children.length; i += 1) {
                if (node.children[i].name === 'w:sdt') {
                    placeholders.push(node.children[i]);
                } else if (node.children[i].children && node.children[i].children.length) {
                    placeholders = placeholders.concat(findPlaceholders(node.children[i]));
                }
            }
            return placeholders;
        }
        function fillPlaceholders(xml, model, pname) {
            function findNode(node, name) {
                var i, deep;
                if (node.name === name) {
                    return node;
                }
                for (i = 0; i < node.children.length; i += 1) {
                    if ((deep = findNode(node.children[i], name)) !== undefined) {
                        return deep;
                    }
                }
            }
            var i, j, k, phName, placeholders = findPlaceholders(xml);
            for (i = 0; i < placeholders.length; i += 1) {
                //JSON.stringify(placeholders[i], function (key, val) { if (key === 'parent') { return '_'; } else { return val; } });
                phName = findNode(placeholders[i], 'w:alias').attributes['w:val'];
                if (phName && model[phName]) {
                    if (model[phName] instanceof Array) {
                        j = placeholders[i].parent.children.indexOf(placeholders[i]);
                        for (k = 1; k < model[phName].length; k += 1) {
                            placeholders[i].parent.children.splice(j + 1, 0, angular.copy(placeholders[i]));
                        }
                        for (k = 0; k < model[phName].length; k += 1) {
                            fillPlaceholders(findNode(placeholders[i].parent.children[j + k], 'w:sdtContent'), model[phName][k], phName);
                        }
                    } else {
                        findNode(placeholders[i], 'w:t').content = model[phName];
                    }
                } else {
                    findNode(placeholders[i], 'w:t').content = '';
                }
            }
        }
        //JSZipUtils.getBinaryContent('data/easy.docx', function (err, data) {
        JSZipUtils.getBinaryContent('data/brd-template.docx', function (err, data) {
            if (!err) {
                console.log("Word template document was retrieved successfully.");
                template = new JSZip(data);
                //console.log("Content of word/document.xml:\n" + docx.file("word/document.xml").asText());
            } else {
                console.error(err);
            }
        });
        
        return {
            "generate": function (plan) {
                if (!plan) {
                    return;
                }
                var docx = angular.copy(template), json, date = new Date().getFullYear().toString() + ('0' + (new Date().getMonth() + 1)).slice(-2) + ('0' + new Date().getDate()).slice(-2);
                json = xml2json(docx.file("word/document.xml").asText(), true);
                fillPlaceholders(json.root, transformModel(plan));
                docx.file("word/document.xml", json2xml(json));
                saveAs(docx.generate({type: "blob"}), date + ' BRD - ' + plan.name + '.docx');
                //console.log(json2xml(xml2json(template.file("word/document.xml").asText())));
                //console.log(docx.file("word/document.xml").asText());
            }
        };
    }]);

    // define controller for writer
    angular.module('TheApp').controller('writerController', ['writerService', 'assembleService', function (writerService, assembleService) {

        this.check = function () {
        };
        this.getPlan = function () {
            return assembleService.getPlanEdit();
        };
        this.getMasterName = function (feature) {
            return feature.masterPath[2];
        };
        this.getTotalAttributes = function (feature) {
            var key, count = 0;
            for (key in feature) {
                if (feature.hasOwnProperty(key)) {
                    count += 1;
                }
            }
            return count;
        };
        this.generate = function () {
            writerService.generate(assembleService.getPlanEdit());
        };

    }]);

}(window.angular));