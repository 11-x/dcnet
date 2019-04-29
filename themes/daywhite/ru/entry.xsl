<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<head>
		<title>DCNet &#8212; Вход</title>
		<xsl:for-each select="/entry/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
		<script language="javascript" src="/themes/daywhite/ru/entry.js">
		</script>
	</head>
	<body onload="body_onload();">
		DCNet: Dreams Cartography Network<br/>
		Вход<br/>
		user:<input id="user" /><br/>
		pass:<input id="pass" type="password" /><br/>
		<button
			id="login_btn"
			onclick="login_btn_clicked();"
		>Войти</button><br/>
		<a href="{/entry/register}">Зарегистрироваться</a><br/>
		<a href="{/entry/readme}">Что это за место?</a><br/>
		<a href="#" onclick="forget()">Забыть меня</a><br/>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
