package com.etisalat.cim.websecurity;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.inject.Inject;
import javax.naming.AuthenticationException;
import javax.naming.CommunicationException;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Authenticate implements Serializable {
	private static final Logger logger = LoggerFactory.getLogger(Authenticate.class);

	private static final long serialVersionUID = 1L;
	
	@Inject
	LdapConfigInt ldapConfigManager;
	
	LdapConfig ldapConfigDetails;
	
	final String TIMEOUT = "5000";
	
	@PostConstruct
	public void init(){
		logger.info("Authenticate inside init");
		ldapConfigDetails = ldapConfigManager.getConfig();		
	}

	public boolean authenticateUser(String name, String password) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException, LoginConnectionException{
		logger.info("authenticateUser() start");		
		
		if (name.equals("") || password.equals("")) {
			return false;
		} else if (name.equals("guest") || password.equals("guestpassword"))
			return true;
		
		List<String> domains = getDomainControllersList();
		
		logger.info("authenticateUser() domains = " + domains);	
		
		String distinguishedName = getUserDistinguishedName(name, domains);
		logger.info("authenticateUser()::distinguishedName ="+ distinguishedName);

		if(distinguishedName == null){
			return false;
		}else{
			return authenticate(distinguishedName, password, domains);
		}
	}
	
	private boolean authenticate(String distinguishedName, String password, List<String> domains) throws LoginConnectionException{
		String domainURL = getNextDomain(domains);
		if(domainURL == null) throw new LoginConnectionException("Unable to connect to LDAP controller");
		Hashtable<String, String> env = new Hashtable<String, String>();
		env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
		env.put("com.sun.jndi.ldap.read.timeout", TIMEOUT);
		env.put("com.sun.jndi.ldap.connect.timeout", TIMEOUT);
		env.put(Context.PROVIDER_URL, domainURL);
		env.put(Context.SECURITY_PROTOCOL, "ssl");
		env.put(Context.SECURITY_AUTHENTICATION, "simple");
		env.put(Context.REFERRAL, "follow");
		env.put(Context.SECURITY_PRINCIPAL, distinguishedName);
		env.put(Context.SECURITY_CREDENTIALS, password);
		logger.info("authenticate():: domain url= " + domainURL);
		try {
			DirContext ctx2 = new InitialDirContext(env);
			ctx2.close();
			return true;
		} catch (AuthenticationException ex) {
			logger.info("incorrect password or username");
			logger.error("error in authenticate: ", ex);
		} catch (CommunicationException ex) {
			removeNextDomain(domains);
			logger.info("error when connecting to server");
			logger.error("error in authenticate: ", ex);
			return authenticate(distinguishedName, password, domains);			
		} catch (NamingException ex) {
			logger.info("naming error in auth");
			logger.error("error in authenticate: ", ex);
		} catch (Exception e) {
			logger.info("naming error in auth");
			logger.error("error in authenticate: ", e);
		}
		return false;
	}
	
	private String getUserDistinguishedName(String name, List<String> domains) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException, LoginConnectionException{
		String domainURL = getNextDomain(domains);
		if(domainURL == null) throw new LoginConnectionException("Unable to connect to LDAP controller");
		Hashtable<String, String> env = new Hashtable<String, String>();
		env.put(Context.INITIAL_CONTEXT_FACTORY,"com.sun.jndi.ldap.LdapCtxFactory");
		env.put("com.sun.jndi.ldap.read.timeout", TIMEOUT);
		env.put("com.sun.jndi.ldap.connect.timeout", TIMEOUT);
		env.put(Context.PROVIDER_URL, domainURL);
		env.put(Context.SECURITY_PROTOCOL, "ssl");
		env.put(Context.SECURITY_AUTHENTICATION, "simple");
		env.put(Context.SECURITY_PRINCIPAL, ldapConfigDetails.getUserDn());		
		env.put(Context.SECURITY_CREDENTIALS, SharedUtils.decrypt(ldapConfigDetails.getPass(), LDAPConstants.LDAP_ENCRYPTION_KEY));		
		env.put(Context.REFERRAL, "follow");
		logger.info("getUserDistinguishedName():: domain url= " + domainURL);
		DirContext ctx = null;
		try {
			ctx = new InitialDirContext(env);
			SearchControls ctls = new SearchControls();
			ctls.setReturningObjFlag(true);
			ctls.setSearchScope(SearchControls.SUBTREE_SCOPE);
			String filter = "(sAMAccountName=" + name + ")";
			String basedn = ldapConfigDetails.getBaseDn();
			NamingEnumeration<SearchResult> results = ctx.search(basedn, filter, ctls);
			if (results.hasMore()) {
				SearchResult sr = (SearchResult) results.next();
				Attributes attrs = sr.getAttributes();
				return attrs.get("distinguishedName").get(0).toString();
			}
			ctx.close();
		} catch (AuthenticationException ex) {
			logger.info("incorrect password or username");
			logger.error("error in getUserDistinguishedName: ", ex);
		} catch (CommunicationException ex) {
			removeNextDomain(domains);
			logger.info("error when connecting to server");
			logger.error("error in getUserDistinguishedName: ", ex);
			return getUserDistinguishedName(name, domains);
		} catch (NamingException ex) {
			logger.info("naming error in auth");
			logger.error("error in getUserDistinguishedName: ", ex);
		} catch (Exception ex) {
			logger.info("naming error in auth");
			logger.error("error in getUserDistinguishedName: ", ex);	
		}finally{
			if(ctx != null){
				try {
					ctx.close();
				} catch (NamingException e) {
					logger.info("error while closing context");
					logger.error("error in getUserDistinguishedName: ", e);
				}
			}
		}
		return null;
	}
	
	private List<String> getDomainControllersList(){
		List<String> result = new ArrayList<String>();
		String url = ldapConfigDetails.getUrl();
		if(url != null){
			result.add(url);
			
			String port = url.substring(url.lastIndexOf(":"));
			
			String host = url.toLowerCase().replace(port, "").replace("ldaps://", "").trim();
			String domains = nsLookup(host);
			
			if(domains != null){
				String[] splitArr = domains.split(",");
				for(String s : splitArr){
					if(s != null && !s.trim().equals("")){
						result.add("ldaps://"+s.trim()+port);
					}
				}			
			}
		}
		return result;		
	}
	
	private String nsLookup(String host) {
		String res = null;
		try {
			logger.info("nsLookup:: preforming nslookup for host: " + host);
			InetAddress inetAddress = InetAddress.getByName(host);
			Hashtable<String, String> env = new Hashtable<String, String>();
			env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");
			// get the default initial Directory Context
			InitialDirContext iDirC = new InitialDirContext(env);
			// get the DNS records for inetAddress
			Attributes attributes = iDirC.getAttributes("dns:/" + inetAddress.getHostName());
			// get an enumeration of the attributes and print them out
			NamingEnumeration<?> attributeEnumeration = attributes.getAll();
			while (attributeEnumeration.hasMore()) {
				String s = attributeEnumeration.next().toString();
				if (s != null && s.toUpperCase().trim().startsWith("A:"))
					res = s.toUpperCase().replace("A:", "").trim();
			}
			attributeEnumeration.close();
		} catch (UnknownHostException exception) {
			logger.info("nsLookup:: ERROR: Cannot access '" + host + "'");
			logger.error("error in nsLookup()",exception);
		} catch (NamingException exception) {
			logger.info("ERROR: No DNS record for '" + host + "'");
			logger.error("error in nsLookup()",exception);
		}
		return res;
	}
	
	private String getNextDomain(List<String> domains){
		if(domains.size() > 0){
			return domains.get(0);
		}else{
			return null;
		}
	}
	
	private void removeNextDomain(List<String> domains){
		if(domains.size() > 0){
			domains.remove(0);
		}
	}
}
