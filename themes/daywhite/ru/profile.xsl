<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<head>
		<title>DCNet &#8212; Профиль</title>
		<xsl:for-each select="/profile/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
		<script language="javascript" src="/themes/daywhite/ru/profile.js">
		</script>
	</head>
	<body>
		DCNet: Dreams Cartography Network<br/>
		Профиль<br/>
		user: <xsl:value-of select="/profile/username"/><br/>
		<input type="hidden" id="user" value="{/profile/username}" />
		<input type="hidden" id="salt" value="{/profile/salt}" />
		<input type="hidden" id="user_id" value="{/profile/userid}" />
		pass:<input id="pass" type="password" /><br/>
		Новый пароль:<input id="new_pass" type="password" /><br/>
		Подтверждение:<input id="new_pass2" type="password" /><br/>
		email:<input
			placeholder="необязательно"
			id="email" type="email"
			value="{/profile/email}"
			/><br/>
		<button
			id="save_btn"
			onclick="save_btn_clicked();"
		>Сохранить</button><br/>
		<a href="{/profile/exit}">Домой</a><br/>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
