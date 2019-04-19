<?
	require('common.php');

	if (is_logged_in()) {
		redirect('/');
	}

	$scripts=array('register.js');

	require('header.php');
?>

	<table>
		<tr>
			<td>&nbsp;</td>
			<td align="left">
				<div class="title">DCNet registration</div>
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">user:</span>
			</td>
			<td>
				<input
					class="textinput start_focus" 
					id="user" 
					autocomplete="off"
					tabindex="1" />
					
					<span
						class="error_msg"
						id="err_user" />
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">pass:</span>
			</td>
			<td>
				<input 
					class="passinput" 
					id="pass" 
					type="password" 
					tabindex="2" />
					
					<span
						class="error_msg"
						id="err_pass" />
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">confirm:</span>
			</td>
			<td>
				<input 
					class="passinput" 
					id="pass2" 
					type="password" 
					tabindex="3" />
					
					<span
						class="error_msg"
						id="err_pass2" />
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">email:</span>
			</td>
			<td>
				<input 
					id="email" 
					type="email" 
					placeholder="optional"
					tabindex="4" />
					
					<span
						class="error_msg"
						id="err_email" />
			</td>
		</tr>
		<tr>
			<td align="right">&nbsp;</td>
			<td>
				<button
					tabindex="5"
					id="send_button"
					onclick="send_button_clicked(this);"
				>send</button>
			</td>
		</tr>
	</table>
<? require('footer.php'); ?>
