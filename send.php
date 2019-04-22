<?

	$addr=$_GET['addr'];

/*	$res=mail($addr, "the subject!",
		"body text, here the link: <a href=\"" .
		"/recover.php?token=sadfawjepofiasdo\">recover</a>",
		'From: admin@dcnet.rf.gd' . "\r\n");
*/
?>
sent mail to <?=$addr?>. Result: <?=var_dump($res)?>
