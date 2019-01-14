﻿<?php
include_once $_SERVER ['DOCUMENT_ROOT'] . '/upacp_demo_wtz/sdk/acp_service.php';
/**
 * 交易说明：	前台类交易成功才会发送后台通知。后台类交易（有后台通知的接口）交易结束之后成功失败都会发通知。
 *              为保证安全，涉及资金类的交易，收到通知后请再发起查询接口确认交易成功。不涉及资金的交易可以以通知接口respCode=00判断成功。
 *              未收到通知时，查询接口调用时间点请参照此FAQ：https://open.unionpay.com/ajweb/help/faq/list?id=77&level=0&from=0
 */

if($_SERVER['REQUEST_METHOD'] == "POST"){
	doPost();
} else {
	doGet(); 
}

function doGet(){
	// 无跳转产品的前台开通失败会get方式请求，不带报文数据。
	// 其他产品不会get方式访问，不用处理get的内容。
	echo "开通失败";
}

function doPost(){

	$logger = com\unionpay\acp\sdk\LogUtil::getLogger();
	$logger->LogInfo("receive front notify: " . com\unionpay\acp\sdk\createLinkString ( $_POST, false, true ));
	
?>
<!DOCTYPE unspecified PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>响应页面</title>

<style type="text/css">
body table tr td {
	font-size: 14px;
	word-wrap: break-word;
	word-break: break-all;
	empty-cells: show;
}
</style>
</head>
<body>
	<table width="800px" border="1" align="center">
		<tr>
			<th colspan="2" align="center">响应结果</th>
		</tr>
	
			<?php
			foreach ( $_POST as $key => $val ) {
				?>
			<tr>
			<td width='30%'><?php echo isset($mpi_arr[$key]) ?$mpi_arr[$key] : $key ;?></td>
			<td><?php echo $val ;?></td>
		</tr>
			<?php }?>
			<tr>
			<td width='30%'>验证签名</td>
			<td><?php			
			if (isset ( $_POST ['signature'] )) {
				echo com\unionpay\acp\sdk\AcpService::validate ( $_POST ) ? '验签成功' : '验签失败';
			} else {
				echo '签名为空';
			}
			?></td>
		</tr>
	</table>
	<?php 
		
		//后面是获取各域的值的参考代码
		$orderId = $_POST ['orderId']; //其他字段也可用类似方式获取
		$respCode = $_POST ['respCode'];
        //判断respCode=00、A6后，对涉及资金类的交易，请再发起查询接口查询，确定交易成功后更新数据库。
		
		//如果卡号我们业务配了会返回且配了需要加密的话，请按此方法解密
// 		if(array_key_exists ("accNo", $_POST)){
// 			$accNo = com\unionpay\acp\sdk\AcpService::decryptData($_POST["accNo"]);
// 			echo  "accNo=" . $accNo . "<br>\n";
// 		}
		
		//customerInfo子域的获取
		if (array_key_exists("customerInfo", $_POST)) {
            echo "customerInfo子域：<br>\n";
			$customerInfo = com\unionpay\acp\sdk\AcpService::parseCustomerInfo($_POST["customerInfo"]);
			if (array_key_exists("phoneNo", $customerInfo)) {
				$phoneNo = $customerInfo["phoneNo"]; //customerInfo其他子域均可参考此方式获取
			}
			foreach ($customerInfo as $key => $value) {
				echo  $key . "=" . $value . "<br>\n";
			}
		}
		
		//$tokenPayData子域的获取
		if (array_key_exists("tokenPayData", $_POST)) {
            echo "tokenPayData子域：<br>\n";
            $tokenPayData = $_POST["tokenPayData"];
			$tokenPayData = com\unionpay\acp\sdk\parseQString(substr($tokenPayData, 1, strlen($tokenPayData)-2));
			if (array_key_exists("token", $tokenPayData)) {
				$token = $tokenPayData["token"]; //customerInfo其他子域均可参考此方式获取
			}
			foreach ($tokenPayData as $key => $value) {
				echo  $key . "=" . $value . "<br>\n";
			}
		}
	?>
</body>
</html>
<?php 
}
?>