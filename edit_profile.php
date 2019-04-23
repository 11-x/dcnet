<?
	require_once('common.php');
	require_once('users.php');

	$user_id=get_logged_user();
	if (empty($user_id)) {
		redirect('/');
	}

	$info=get_user_info($user_id);
	$username=$info['username'];
	$email=empty($info['email'])? '': $info['email'];
	$salt=$info['salt'];

	$scripts=array('edit_profile.js');

	require('header.php');
?>
	<input type="hidden" id="salt" value="<?=$salt?>" />
	<input type="hidden" id="user_id" value="<?=$user_id?>" />
	<table>
		<tr>
			<td>&nbsp;</td>
			<td align="left">
				<div class="title">Edit profile</div>
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">user:</span>
			</td>
			<td>
				<span id="username"><?=$username?></span>
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">current pass:</span>
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
				<span class="label">new pass:</span>
			</td>
			<td>
				<input 
					class="passinput" 
					id="new_pass" 
					type="password" 
					tabindex="3" />
			</td>
		</tr>
		<tr>
			<td align="right">
				<span class="label">confirm:</span>
			</td>
			<td>
				<input 
					class="passinput" 
					id="new_pass2" 
					type="password" 
					tabindex="4" />
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
					tabindex="5"
					value="<?=$email?>"/>
			</td>
		</tr>
		<tr>
			<td align="right">&nbsp;</td>
			<td>
				<button
					tabindex="5"
					id="send_button"
					onclick="send_button_clicked(this);"
				>update</button>
			</td>
		</tr>
		<tr>
			<td align="right">&nbsp;</td>
			<td>
				<hr/>
				<button
					tabindex="5"
					onclick="unregister();"
					id="unregister_button"
				>destroy account</button>
			</td>
		</tr>
	</table>
<? require('footer.php'); ?>
