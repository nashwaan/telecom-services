// silence JSLint error: variable used before it was defined
/*global angular*/
/*global JSZip,JSZipUtils*/
/*global xml2json,json2xml*/
/*global saveAs*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('writerService', ['$http', 'assembleService', function ($http, assembleService) {
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
                    if (angular.isArray(val)) {
                        obj['total' + key] = val.length;
                        var i;
                        for (i = 0; i < val.length; i += 1) {
                            setTotals(val[i]);
                        }
                    } else if (angular.isObject(val)) {
                        setTotals(val);
                    }
                });
            }(transform));
            transform.Definitions = [];
            transform.Bands.forEach(function (band) {
                band.Rules = [];
                band.Flavors.forEach(function (flavor) {
                    flavor.Features.forEach(function (feature) {
                        if (!feature._visited) {
                            var rule = {};
                            rule.name = assembleService.getFeatureName(feature);
                            rule.kind = assembleService.getFeatureKind(feature);
                            var matchedFeatures = [];
                            band.Flavors
                                .filter(function (fl) { return fl.name !== flavor.name; })
                                .forEach(function (fl) {
                                    matchedFeatures = fl.Features
                                        .filter(function(f) {
                                            return rule.name === assembleService.getFeatureName(f) && rule.kind === assembleService.getFeatureKind(f);
                                        })
                                        .map(function (f) {
                                            return {flavor: fl, feature: f};
                                        });
                                });
                            rule.Subrules = [];
                            angular.forEach(feature, function (val, key) {
                                if (key !== 'masterPath') {
                                    var Flavors = [], title = assembleService.getSubfeatureProp(feature, key, 'title');
                                    if (title) {
                                        Flavors.push({
                                            attribute: title,
                                            flavor: flavor.name,
                                            value: val
                                        });
                                        matchedFeatures.forEach(function (mfeature) {
                                            mfeature.feature._visited = true;
                                            if (mfeature.feature.hasOwnProperty(key)) {
                                                Flavors.push({
                                                    attribute: title,
                                                    flavor: mfeature.flavor.name,
                                                    value: mfeature.feature[key]
                                                });
                                            }
                                        });
                                        rule.Subrules.push({Flavors: Flavors});
                                        if (!transform.Definitions.filter(function (d) {return d.term === title;}).length) {
                                            transform.Definitions.push({
                                                term: title,
                                                description: assembleService.getSubfeatureProp(feature, key, 'definition')
                                            });
                                        }
                                    }
                                }
                            });
                            band.Rules.push(rule);
                        }
                    });
                });
            });
            return transform;
        }
        
        function fillPlaceholders(xml, model) {
            function findPlaceholders(node) {
                var i, placeholders = [];
                for (i = 0; i < node.children.length; i += 1) {
                    if (node.children[i].name === 'w:sdt') {
                        placeholders.push({parent: node, location: i});
                    } else if (node.children[i].children && node.children[i].children.length) {
                        placeholders = placeholders.concat(findPlaceholders(node.children[i]));
                    }
                }
                return placeholders;
            }
            function findNode(node, name) {
                if (!node) {
                    console.log('conditional breakpoint');
                }
                var i, deep;
                if (node.name === name) {
                    return node;
                }
                if (node.children && node.children.length) {
                    for (i = 0; i < node.children.length; i += 1) {
                        if ((deep = findNode(node.children[i], name)) !== undefined) {
                            return deep;
                        }
                    }
                }
            }
            var i, j, k, phName, children, placeholders = findPlaceholders(xml), parent, placeholder;
            for (i = 0; i < placeholders.length; i += 1) {
                parent = placeholders[i].parent;
                j = placeholders[i].location;
                placeholder = parent.children[j];
                phName = findNode(placeholder, 'w:alias').attributes['w:val'];
                if (phName && model.hasOwnProperty(phName)) {
                    /*if (phName === 'Contributors' || model[phName] === 'Charge Amount')
                        {console.log('conditional breakpoint');}*/
                    if (angular.isArray(model[phName])) {
                        children = [];
                        //j = parent.children.indexOf(placeholder);
                        /*for (j = 0; j <= parent.children.length; j += 1) {
                            if (angular.equals(placeholder, parent.children[j])) {
                                break;
                            }
                        }*/
                        /*if (j < 0)
                            {continue;}*/
                        for (k = 0; k <= j; k += 1) {
                            children.push(parent.children[k]);
                        }
                        for (k = 1; k < model[phName].length; k += 1) {
                            children.push(angular.copy(placeholder));
                        }
                        for (k = j + model[phName].length; k < parent.children.length; k += 1) {
                            children.push(parent.children[k]);
                        }
                        delete parent.children;
                        parent.children = children;
                        for (k = 0; k < model[phName].length; k += 1) {
                            fillPlaceholders(findNode(parent.children[j + k], 'w:sdtContent'), model[phName][k], phName);
                        }
                    } else {
                        findNode(placeholder, 'w:t').content = model[phName];
                    }
                } else {
                    console.warn("Could not find matching model for placeholder '" + phName + "'.");// + " Current model: \n", JSON.stringify(model, function (k, v) {return k === 'parent'? '_' : v;}));
                    findNode(placeholder, 'w:t').content = '';
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
                json = xml2json(docx.file("word/document.xml").asText(), false);
                fillPlaceholders(json.root, transformModel(plan));
                docx.file("word/document.xml", json2xml(json));
                //console.log('Plan transformed to BRD structure:\n', JSON.stringify(json, function (k, v) {return k === 'parent'? '_' : v;}));
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
            //assembleService.select();
            writerService.generate(assembleService.getPlanEdit());
        };

    }]);

}(window.angular));