<?
	require_once('common.php');
	require_once('users.php');

	if (!empty(get_logged_user())) {
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
					autocapitalize="off"
					tabindex="1" />
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
