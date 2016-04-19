function json2xml(json, depth) {
    'use strict';
    depth = depth || 0;
    var i, key, sp = 4, node = Array(depth * sp + 1).join(' ');
    if (json.declaration) {
        node += '<?xml';
        for (key in json.declaration.attributes) {
            if (json.declaration.attributes.hasOwnProperty(key)) {
                node += ' ' + key + '="' + json.declaration.attributes[key] + '"';
            }
        }
        node += '?>' + '\n';
        json = json.root;
    }
    node += '<' + json.name;
    if (json.attributes) {
        for (key in json.attributes) {
            if (json.attributes.hasOwnProperty(key)) {
                node += ' ' + key + '="' + json.attributes[key] + '"';
            }
        }
    }
    if (json.hasOwnProperty('content') || (json.children && json.children.length) || (json.attributes && json.attributes['xml:space'] === 'preserve')) {
        node += '>';
        if (json.hasOwnProperty('content')) {
            switch (typeof json.content) {
                case 'string':  node += json.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); break;
                case 'boolean':  node += json.content? 'Applied' : 'Not applied'; break;
                default:  node += json.content;
            }
        }
        if (json.children && json.children.length) {
            node += '\n';
            for (i = 0; i < json.children.length; i += 1) {
                node += json2xml(json.children[i], depth + 1);
            }
            node += Array(depth * sp + 1).join(' ');
        }
        node += '</' + json.name + '>' + '\n';
    } else {
        node += '/>' + '\n';
    }
    return node;
}

function xml2json(xml, addParent) {
    'use strict';
    /*jslint regexp: true*/
    xml = xml.trim();
    xml = xml.replace(/<!--[\s\S]*?-->/g, ''); // strip comments
    function startsWith(prefix) {
        return xml.indexOf(prefix) === 0;
    }
    function match(regex) {
        var m = xml.match(regex);
        if (!m) {
            return;
        }
        xml = xml.slice(m[0].length); // advance the string
        return m;
    }
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, ''); // strip quotes from `val`
    }
    function isEnd() {
        return xml.length === 0;
    }
    function content() {
        //console.log('content %j', xml);
        var m = match(/^([^<]*)/);
        if (m) {
            return m[1];
        }
        return '';
    }
    function attribute() {
        //console.log('attribute %j', xml);
        var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m) {
            return;
        }
        return {
            name: m[1],
            value: strip(m[2])
        };
    }
    function tag() {
        //console.log('tag %j', xml);
        var node, m = match(/^<([\w-:.]+)\s*/), child, attr;
        if (!m) {
            return;
        }
        node = {
            name: m[1],
            attributes: {},
            children: []
        };
        while (!(isEnd() || startsWith('>') || startsWith('?>') || startsWith('/>'))) {
            attr = attribute();
            if (!attr) {
                return node;
            }
            node.attributes[attr.name] = attr.value;
        }
        if (match(/^\s*\/>\s*/)) { // self closing tag
            return node;
        }
        match(/\??>/); // originally: match(/\??>\s*/);
        node.content = content();
        while ((child = tag()) !== undefined) {
            if (addParent) {
                child.parent = node;
            }
            node.children.push(child);
        }
        match(/^<\/[\w-:.]+>\s*/); // closing
        return node;
    }
    function declaration() {
        var node, m = match(/^<\?xml\s*/), attr;
        if (!m) {
            return;
        }
        node = {
            attributes: {}
        };
        while (!(isEnd() || startsWith('?>'))) {
            attr = attribute();
            if (!attr) {
                return node;
            }
            node.attributes[attr.name] = attr.value;
        }
        match(/\?>\s*/);
        return node;
    }
    function document() {
        return {
            declaration: declaration(),
            root: tag()
        };
    }
    /*jslint regexp: false*/
    return document();
}