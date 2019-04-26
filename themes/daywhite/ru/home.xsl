<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<head>
		<title>DCNet &#8212; Главная</title>
		<xsl:for-each select="/home/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
		<script language="javascript" src="/themes/daywhite/ru/home.js">
		</script>
	</head>
	<body>
		DCNet: Dreams Cartography Network<br/>
		Главная (в разработке)<br/>
		Привет, <xsl:value-of select="/home/username" />!<br/>
		<a href="{/home/profile}">Профиль</a><br/>
		<a href="{/home/logoff}">Выйти</a><br/>

	</body>
</html>
</xsl:template>
</xsl:stylesheet>
