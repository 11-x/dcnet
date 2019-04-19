<?
	require('common.php');

	if (is_logged_in()) {
		redirect('/');
	}

	require('header.php');
?>
<form method="post" action="login.php" autocomplete="off">
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
					name="user" 
					tabindex="1" />
			</td>
			<td rowspan="2">
				<input 
					class="enterbutton" 
					type="submit"
					value="&#x2386;" 
					tabindex="3" />
			</td>	
		</tr>
		<tr>
			<td align="right">
				<span class="label">pass:</span>
			</td>
			<td>
				<input 
					class="passinput" 
					name="pass" 
					type="password" 
					tabindex="2" />
			</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td colspan="2">
				<a href="recover_pass.php">lost pass</a>
			</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td colspan="2">
				<a href="register.php">register</a>
			</td>
		</tr>	
	</table>
</form>	
<? require('footer.php'); ?>
