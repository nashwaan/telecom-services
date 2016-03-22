/*jslint node: true */
'use strict';

// MySQL test: (create on database 'abook' with username 'abook' and password 'abook')
//
// CREATE TABLE IF NOT EXISTS `users` (
//   `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
//   `username` varchar(50) NOT NULL,
//   `password` varchar(50) NOT NULL,
//   PRIMARY KEY (`id`),
//   KEY `username` (`username`)
// ) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
// INSERT INTO `users` (`username`, `password`) VALUES
// ('demo', 'demo');
// CREATE TABLE IF NOT EXISTS `contacts` (
//   `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
//   `user_id` int(5) unsigned NOT NULL,
//   `name` varchar(100) NOT NULL,
//   `email` varchar(255) NOT NULL,
//   PRIMARY KEY (`id`),
//   KEY `user_id` (`user_id`)
// ) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
// INSERT INTO `contacts` (`user_id`, `name`, `email`) VALUES
// (1, 'John Doe', 'john.doe@example.com'),
// (1, 'Jane Doe', 'jane.doe@example.com');
//

var ldap = require('ldapjs'),
    mysql = require("mysql"),
    server = ldap.createServer(),
    addrbooks = {},
    userinfo = {},
    ldap_port = 389,
    basedn = "dc=example, dc=com",
    company = "Example",
    db = mysql.createClient({
        user: "abook",
        password: "abook",
        database: "abook"
    });

db.query("SELECT c.*,u.username,u.password " + "FROM contacts c JOIN users u ON c.user_id=u.id",
    function (err, contacts) {
        var i, p;
        if (err) {
            console.log("Error fetching contacts", err);
            process.exit(1);
        }
        for (i = 0; i < contacts.length; i += 1) {
            if (!addrbooks.hasOwnProperty(contacts[i].username)) {
                addrbooks[contacts[i].username] = [];
                userinfo["cn=" + contacts[i].username + ", " + basedn] = {
                    abook: addrbooks[contacts[i].username],
                    pwd: contacts[i].password
                };
            }
            p = contacts[i].name.indexOf(" ");
            if (p != -1) {
                contacts[i].firstname = contacts[i].name.substr(0, p);
            }
            p = contacts[i].name.lastIndexOf(" ");
            if (p != -1) {
                contacts[i].surname = contacts[i].name.substr(p + 1);
            }
            addrbooks[contacts[i].username].push({
                dn: "cn=" + contacts[i].name + ", " + basedn,
                attributes: {
                    objectclass: ["top"],
                    cn: contacts[i].name,
                    mail: contacts[i].email,
                    givenname: contacts[i].firstname,
                    sn: contacts[i].surname,
                    ou: company
                }
            });
        }

        server.bind(basedn, function (req, res, next) {
            var username = req.dn.toString(),
                password = req.credentials;
            if (!userinfo.hasOwnProperty(username) || userinfo[username].pwd != password) {
                return next(new ldap.InvalidCredentialsError());
            }
            res.end();
            return next();
        });

        server.search(basedn, function (req, res, next) {
            var i, binddn = req.connection.ldap.bindDN.toString();
            if (userinfo.hasOwnProperty(binddn)) {
                for (i = 0; i < userinfo[binddn].abook.length; i += 1) {
                    if (req.filter.matches(userinfo[binddn].abook[i].attributes)) {
                        res.send(userinfo[binddn].abook[i]);
                    }
                }
            }
            res.end();
            return next();
        });

        server.listen(ldap_port, function () {
            console.log("Addressbook started at %s", server.url);
        });
    });