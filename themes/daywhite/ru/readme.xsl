<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<head>
		<title>DCNet &#8212; О проекте</title>
		<xsl:for-each select="/readme/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
	</head>
	<body>
		DCNet: Dreams Cartography Network<br/>
		О проекте<br/>
		<input type="hidden" id="username" value="{/readme/username}" />
		<xsl:copy-of select="/readme/text" />
		<p>
			<a href="{/readme/back}">Назад</a>
		</p>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
