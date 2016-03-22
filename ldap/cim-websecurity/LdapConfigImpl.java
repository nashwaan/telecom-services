package com.etisalat.cim.websecurity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.EJB;

import com.etisalat.cim.dataaccess.Dao;

public class LdapConfigImpl implements LdapConfigInt {

	@EJB
	private transient Dao dao;

	@Override
	public LdapConfig getConfig() {
		List configs = dao.executeNativeQueryWithParam(
				LDAPConstants.LDAP_CONFIG_QUERY,
				LDAPConstants.LDAP_ADAPTER_NAME);
		Map<String, String> confMap = new HashMap<String, String>();
		for (Object o : configs) {
			Object[] row = (Object[]) o;
			confMap.put((String) row[0], (String) row[1]);
		}
		return LdapConfig.getInstance(confMap);
	}

	// public void save(LdapConfig conf) {
	// dao.executeUpdateNativeQuery(generatSaveQuery(toMap(conf)).toArray());
	// }

	// public Map<String, String> toMap(LdapConfig conf) {
	// Map<String, String> m = new HashMap<String, String>(0);
	// m.put("ldap.user", conf.getUser());
	// try {
	// m.put("ldap.pass", SharedUtils.encrypt(conf.getPass(),
	// LDAPConstants.LDAP_ENCRYPTION_KEY));
	// } catch (InvalidKeyException | NoSuchAlgorithmException
	// | NoSuchPaddingException | IllegalBlockSizeException
	// | BadPaddingException | UnsupportedEncodingException e) {
	// e.printStackTrace();
	// }
	// m.put("ldap.url", conf.getUrl());
	// m.put("ldap.ldap.username", conf.getLdapUsername());
	// m.put("ldap.base.dn", conf.getBaseDn());
	// m.put("ldap.user.dn", conf.getUserDn());
	// m.put("ldap.search.attribute", conf.getSearchAttribute());
	// m.put("ldap.dom.conIp1", conf.getDomConIp1());
	// m.put("ldap.dom.conIp2", conf.getDomConIp2());
	// m.put("ldap.dom.conIp3", conf.getDomConIp3());
	// return m;
	// }

	// public List<String> generatSaveQuery(Map<String, String> m) {
	// if (m == null || m.size() == 0)
	// return null;
	// final String qTemp =
	// "UPDATE CIM_ADAPTER_SETTINGS SET  VAL = '{value}', ADAPTER_NAME = '"
	// + LDAPConstants.LDAP_ADAPTER_NAME + "' WHERE NAME = '{name}' ";
	// List<String> qList = new ArrayList<String>(0);
	// for (Map.Entry<String, String> entry : m.entrySet()) {
	// qList.add(qTemp.replace("{name}", entry.getKey()).replace(
	// "{value}", entry.getValue()));
	// }
	// return qList;
	// }

}
