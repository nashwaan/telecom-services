package com.etisalat.cim.websecurity;

import java.io.Serializable;
import java.util.Map;

public class LdapConfig implements Serializable {

	private static final long serialVersionUID = -2864173458688821230L;
	private String user;
	private String pass;
	private String url;
	private String ldapUsername;
	private String baseDn;
	private String userDn;
	private String searchAttribute;
	private String domConIp1;
	private String domConIp2;
	private String domConIp3;

	public static LdapConfig getInstance() {
		return new LdapConfig();
	}

	public static LdapConfig getInstance(Map<String, String> p) {
		LdapConfig conf = getInstance();
		conf.setUser(p.get("ldap.user"));
		// conf.setPass("********");
		conf.setPass(p.get("ldap.pass"));
		conf.setUrl(p.get("ldap.url"));
		conf.setLdapUsername(p.get("ldap.ldap.username"));
		conf.setBaseDn(p.get("ldap.base.dn"));
		conf.setUserDn(p.get("ldap.user.dn"));
		conf.setSearchAttribute(p.get("ldap.search.attribute"));
		conf.setDomConIp1(p.get("ldap.dom.conIp1"));
		conf.setDomConIp2(p.get("ldap.dom.conIp2"));
		conf.setDomConIp3(p.get("ldap.dom.conIp3"));
		return conf;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getLdapUsername() {
		return ldapUsername;
	}

	public void setLdapUsername(String ldapUsername) {
		this.ldapUsername = ldapUsername;
	}

	public String getBaseDn() {
		return baseDn;
	}

	public void setBaseDn(String baseDn) {
		this.baseDn = baseDn;
	}

	public String getUserDn() {
		return userDn;
	}

	public void setUserDn(String userDn) {
		this.userDn = userDn;
	}

	public String getSearchAttribute() {
		return searchAttribute;
	}

	public void setSearchAttribute(String searchAttribute) {
		this.searchAttribute = searchAttribute;
	}

	public String getDomConIp1() {
		return domConIp1;
	}

	public void setDomConIp1(String domConIp1) {
		this.domConIp1 = domConIp1;
	}

	public String getDomConIp2() {
		return domConIp2;
	}

	public void setDomConIp2(String domConIp2) {
		this.domConIp2 = domConIp2;
	}

	public String getDomConIp3() {
		return domConIp3;
	}

	public void setDomConIp3(String domConIp3) {
		this.domConIp3 = domConIp3;
	}

}
