<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<head>
		<title>DCNet &#8212; Регистрация</title>
		<xsl:for-each select="/register/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
		<script language="javascript" src="/themes/daywhite/ru/register.js">
		</script>
	</head>
	<body>
		DCNet: Dreams Cartography Network<br/>
		Регистрация<br/>
		user:<input id="user" /><br/>
		pass:<input id="pass" type="password" /><br/>
		подтверждение:<input id="pass2" type="password" /><br/>
		email:<input
			placeholder="необязательно"
			id="email" type="email" /><br/>
		<button
			id="register_btn"
			onclick="register_btn_clicked();"
		>Зарегистрироваться</button><br/>
		<a href="{/register/cancel}">Отменить</a>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
