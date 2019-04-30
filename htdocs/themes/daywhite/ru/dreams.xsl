<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<head>
		<title>DCNet &#8212; Сон</title>
		<xsl:for-each select="/dreams/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
		<script 
			language="javascript"
			src="/themes/daywhite/ru/dreams.js"></script>
	</head>
	<body onload="dreams_onload();">
		<xsl:value-of select="/dreams/username" />
		&#160;
		<a href="{/dreams/back}">Назад</a>
		<hr/>
		<input
			id="query"
			value="{/dreams/query}"
			onkeypress="query_keypressed();"
		/>
		<button onclick="search_btn_clicked()">search</button>
		<br/>
		<xsl:for-each select="/dreams/dreams/dream">
			dream: <a href="/dream.php?id={id}"><xsl:value-of select="title" /></a>
			<br/>
		</xsl:for-each>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
