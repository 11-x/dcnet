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
		<script language="javascript" src="/themes/daywhite/ru/dream.js"></script>
	</head>
	<body onload="dream_onload();">
		<input id="dreamdata" type="hidden" value="{/dream/dreamdata}" />
		<input id="dreamid" type="hidden" value="{/dream/dreamid}" />
		<xsl:value-of select="/dream/username" />
		&#160;
		<a href="{/dream/back}">Назад</a>
		<hr/>
		Сон<br/>
		<input id="date" type="date" /><br/>
		<input id="title" placeholder="title" /><br/>
		<textarea
			id="description"
			placeholder="description"></textarea><br/>
		<span id="tags" 
		/><input
			id="tag" placeholder="tag" 
		/><button
			onclick="add_tag('ptags');"
		>+</button><button
			onclick="add_tag('qtags');"
		>?</button><button
			onclick="add_tag('ntags');"
		>&#x2212;</button>
		<br/>
		<button disabled="true">Добавить схему</button>
		<hr/>
		<button disabled="true">Добавить пузырь</button><br/>
		<hr/>
		Уровень доступа: <select disabled="true">
			<option>доступно всем</option>
			<option>ограничено</option>
			<option>приватно</option>
		</select>
		<br/>
		<button disabled="true">Открыть доступ юзеру/группе</button><br/>
		<button id="send_btn" onclick="dream_send();">Отправить</button>
		<button onclick="dream_leave();">Отменить</button>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
