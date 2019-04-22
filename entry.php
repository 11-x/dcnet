<?
	require('common.php');
	require('users.php');

	if (get_logged_user()!==NULL) {
		redirect('/');
	}

	$scripts=['entry.js'];
	$onload='entry_onload();';
	require('header.php');
?>
	<table>
		<tr>
			<td>&nbsp;</td>
			<td align="left">
				<div class="title">DCNet entry point</div>
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">user:</span>
			</td>
			<td>
				<input
					class="textinput start_focus" 
					name="user" id="user" 
					autocapitalize="off"
					tabindex="1" />
			</td>
			<td rowspan="2">
				<button 
					class="enterbutton" 
					tabindex="3"
					onclick="login_btn_clicked();"
					id="enter_btn">&#x2386;</button>
			</td>	
		</tr>
		<tr>
			<td align="right">
				<span class="label">pass:</span>
			</td>
			<td>
				<input 
					class="passinput" 
					name="pass" id="pass"
					type="password" 
					tabindex="2" />
			</td>
		</tr>
		<tr class="banner">
			<td>&nbsp;</td>
			<td colspan="2">
				<a href="recover_pass.php">lost pass</a>
			</td>
		</tr>
		<tr class="banner">
			<td>&nbsp;</td>
			<td colspan="2">
				<a href="register.php">register</a>
			</td>
		</tr>	
		<tr class="banner">
			<td>&nbsp;</td>
			<td colspan="2">
				<a href="#" onclick="purge();">forget me</a>
			</td>
		</tr>	
		<tr class="banner">
			<td>&nbsp;</td>
			<td colspan="2">
				<a href="/readme.php">README</a>
			</td>
		</tr>
	</table>
<? require('footer.php'); ?>
