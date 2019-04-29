<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<head>
		<title>DCNet &#8212; Сон</title>
		<xsl:for-each select="/dream/scripts/script">
			<script language="javascript" src="{.}"></script>
		</xsl:for-each>
		<script language="javascript" src="/themes/daywhite/ru/dream.js">
		</script>
	</head>
	<body onload="dream_onload();">
		<xsl:value-of select="/dream/username" />
		&#160;
		<a href="{/dream/back}">Назад</a>
		<hr/>
		DCNet: Dreams Cartography Network<br/>
		Сон<br/>
		<input id="date" type="date" /><br/>
		<input placeholder="title" /><br/>
		<textarea placeholder="description"></textarea><br/>
		+дом ?учёба &#x2212;вечер 
		<input placeholder="tag" /><button
		>+</button><button
		>?</button><button
		>&#x2212;</button>
		<hr/>
		<button>Добавить пузырь</button><br/>
		<hr/>
		Уровень доступа: <select>
			<option>доступно всем</option>
			<option>только теги</option>
			<option>приватно</option>
		</select>
		<br/>
		<button>Отправить</button>
		<button>Отменить</button>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
