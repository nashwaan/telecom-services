// silence JSLint error: variable used before it was defined
/*global angular*/
/*global JSZip*/
/*global JSZipUtils*/
/*global saveAs*/
/*global require*/
/*global xml2json*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('writerService', ['$http', function ($http) {
        var docx, xsd;
        function transformModel(plan) {
            var transform = angular.copy(plan);
            transform.Contributors = [
                {name: "Yousuf", title: "Sr Manager", section: "Automation", department: "IT"},
                {name: "Roshan", title: "Sr Manager", section: "Wireless", department: "MKT"},
                {name: "Philip", title: "Manager", section: "Wireless", department: "MKT"}
            ];
            //console.log(JSON.stringify(transform));
            return transform;
        }
        function findPlaceholders(node) {
            var i, placeholders = [];
            for (i = 0; i < node.children.length; i += 1) {
                if (node.children[i].name === 'w:sdt') {
                    placeholders.push(node.children[i]);
                }
                if (node.children[i].children && node.children[i].children.length) {
                    placeholders = placeholders.concat(findPlaceholders(node.children[i]));
                }
            }
            /*for (key in node) {
                if (node.hasOwnProperty(key)) {
                    if (key === 'w:sdt') {
                        placeholders.push(node[key]);
                    } else if (node[key] instanceof Array) {
                        for (i = 0; i < node[key].length; i += 1) {
                            placeholders = placeholders.concat(findPlaceholders(node[key][i]));
                        }
                    } else if (typeof node[key] === 'object') {
                        placeholders = placeholders.concat(findPlaceholders(node[key]));
                    }
                }
            }*/
            return placeholders;
        }
        function fillPlaceholders(xml, model) {
            var i, j, k, phName, SDTs = findPlaceholders(xml);
            //console.log('SDTs: ' + JSON.stringify(SDTs));
            //console.log(SDTs);
            function findInsideProperty(obj, keyName) {
                var i, key, deep;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key === keyName) {
                            return obj[key];
                        } else if (obj[key] instanceof Array) {
                            for (i = 0; i < obj[key].length; i += 1) {
                                if ((deep = findInsideProperty(obj[key][i], keyName)) !== undefined) {
                                    return deep;
                                }
                            }
                        } else if (typeof obj[key] === 'object') {
                            if ((deep = findInsideProperty(obj[key], keyName)) !== undefined) {
                                return deep;
                            }
                        }
                    }
                }
            }
            for (i = 0; i < SDTs.length; i += 1) {
                for (j = 0; j < SDTs[i].length; j += 1) {
                    phName = SDTs[i][j]['w:sdtPr'][0]['w:alias'][0].$['w:val'];
                    if (phName && model[phName]) {
                        if (model[phName] instanceof Array) {
                            console.log('phName: ' + phName);
                            for (k = 1; k < model[phName].length; k += 1) {
                                SDTs[i].splice(j + 1, 0, SDTs[i][j]);
                            }
                            /*for (k = 0; k < model[phName].length; k += 1) {
                                fillPlaceholders(SDTs[i][j + k]['w:sdtContent'][0], model[phName][k]);
                            }*/
                            j += model[phName].length - 1;
                        } else {
                            try {
                                findInsideProperty(SDTs[i][j]['w:sdtContent'], 'w:t')[0] = model[phName];
                            } catch (e) {
                                console.log(JSON.stringify(SDTs[i][j]));
                            }
                        }
                    } else {
                        SDTs[i][j]['w:sdtContent'][0] = {};
                    }
                }
            }
        }
        $http.get('data/wml.xsd').then(function (response) {
            xsd = response.data;
            console.log("Word docx schema was retrieved successfully.");
        }, function (response) {
            console.warn("Could not load plans data.", response);
        });
        JSZipUtils.getBinaryContent('data/easy.docx', function (err, data) {
        //JSZipUtils.getBinaryContent('data/brd-template.docx', function (err, data) {
            if (!err) {
                console.log("Word template document was retrieved successfully.");
                docx = new JSZip(data);
                //console.log("Content of word/document.xml:\n" + docx.file("word/document.xml").asText());
            } else {
                console.error(err);
            }
        });
        
        return {
            "generate": function (plan) {
                //var xml2js = require('xml2js'), xmlParser = new xml2js.Parser(), xmlBuilder = new xml2js.Builder();
                console.log((xml2json(docx.file("word/document.xml").asText())));
                //console.log(json2xml(xml2json(docx.file("word/document.xml").asText())));
                /*xmlParser.parseString(docx.file("word/document.xml").asText(), function (err, xml) {
                    console.log("Heeeeee");
                    if (!err) {
                        console.log(JSON.stringify(xml));
                        fillPlaceholders(xml, transformModel(plan));
                        docx.file("word/document.xml", xmlBuilder.buildObject(xml));
                        saveAs(docx.generate({type: "blob"}), "output1.docx");
                    } else {
                        console.error(err);
                    }
                });*/
            }
        };
    }]);

    // define controller for writer
    angular.module('TheApp').controller('writerController', ['writerService', 'assembleService', function (writerService, assembleService) {

        this.check = function () {
            //window.alert("CHECK:\n" + 'JSON.stringify(assembleService.getPlanEdit().name)');
            /*JSZipUtils.getBinaryContent("data/tagExample.docx", function (err, content) {
                if (!err) {
                    var doc = new Docxgen(content);
                    doc.setData({"first_name": "Hipp", "last_name": "Edgar", "phone": "0652455478", "description": "New Website"}); //set the templateVariables
                    doc.render();
                    saveAs(doc.getZip().generate({type: "blob"}), "output.docx");
                }
            });*/
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