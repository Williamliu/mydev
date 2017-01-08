<div class="public-user-profile">
    <img id="public_user_image" src="ajax/wmliu_getmainimage.php?filter=public_user&mode=small&refid=<?php echo $public_user["id"]?>" style="max-width:180px;" />
    <div style="text-align:left;margin-top:10px;">
        <center style="font-size:18px;">
            <?php echo $public_user["anonym"]?> - <?php echo $public_user["full_name"]?>
        </center>
        <table>
            <tr>
                <td align="right"><?php echo $words["created_time"]?>: </td>
                <td style="color:blue;"><?php echo cTYPE::inttodate($public_user["created_time"])?></td>
            </tr>
            <tr> 	
                <td align="right"><?php echo $words["last_login"]?>: </td>
                <td style="color:blue;"><?php echo cTYPE::inttodate($public_user["last_login"])?></td>
            </tr>
            <tr>                                 	
                <td align="right"><?php echo $words["admin.hits"]?>: </td>
                <td style="color:blue;"><?php echo $public_user["hits"]?></td>
            </tr>
        </table>
    </div>
</div>
