function sendToContent(){finalNum++,3===finalNum&&(chrome.tabs.query({active:!0},function(n){chrome.tabs.sendRequest(n[0].id,{cmd:"basicInfo",data:displayInfo},function(){console.log("sendMessage")})}),finalNum=0)}function getType(n){return Object.prototype.toString.call(n).slice(8,-1)}function sendRequest(n,e){var t=new XMLHttpRequest;t.onreadystatechange=function(){4===t.readyState&&200===t.status&&e(t.responseText)},t.open("GET",n,!0),t.send()}function dataCollection(n,e){if(n=new Function("function $callback(obj){return obj};function jsonp_reviews_list(obj){return obj;}function __jsonp_records_reload(obj){return obj;};return "+n.trim())(),"string"==typeof e?displayInfo.successRate=(n.quantity.paySuccessItems/(n.quantity.paySuccessItems+n.quantity.confirmGoodsItems)*100).toFixed(2):"Array"===getType(n)?e=n:e.push(n),h++,13==h){var t=0,a=0;displayInfo.anonyCommentsRate=0;var o=0,i=0;displayInfo.anonyTradeRate=0;for(var s=0;5>s;s++){var l=infoGroup.commentList[s].comments,r=l&&l.length;t+=r||0;for(var u=0;r>u;u++)JSON.parse(l[u].user.anony)&&a++;var p=infoGroup.tradeDetailList[s].html,d=new RegExp(/tb-buyer/g);~p.indexOf("tb-buyer")&&(o+=p.match(d)?p.match(d).length:0,i+=p.match(new RegExp(/匿名/g))?p.match(new RegExp(/匿名/g)).length:0)}displayInfo.anonyCommentsRate=(a/t*100).toFixed(2),displayInfo.anonyTradeRate=(i/o*100).toFixed(2),displayInfo.badCommentList=displayInfo.badCommentList[0].comments&&badCommentRefine(displayInfo.badCommentList[0].comments),sendToContent()}}function shopInfoBundle(n){var e=n.indexOf('id="J_showShopStartDate"'),t=n.slice(e,n.indexOf("/>",e));displayInfo.shopStartDate=t.match(new RegExp(/[0-9\-]{4,}/g))[0];var a=n.match(/<li>所在地区/g),o=n.lastIndexOf("<li>所在地区")+9;a&&(displayInfo.location=n.slice(o,n.indexOf("</",o)).trim());var i=new RegExp(/id="monthuserid"\svalue="(.*)(?=")/),s=i.exec(n)[1].trim(),l="http://rate.taobao.com/ShopService4C.htm?userNumId="+s+"&shopID="+apiGroup.g_con.shopId+"&isB2C=false",r="http://rate.taobao.com/member_rate.htm?&callback=shop_rate_list&result=-1&user_id="+s;sendRequest(l,function(n){var e=JSON.parse(n);displayInfo.ratRefund={},displayInfo.complaints={},displayInfo.punish={};var t=e.ratRefund,a=e.complaints,o=e.punish;displayInfo.ratRefund.refundCount=t.refundCount,displayInfo.ratRefund.danger=+t.indVal-+t.localVal<=0?!0:!1,displayInfo.ratRefund.localVal=t.localVal,displayInfo.complaints.disputRefundNum=a.disputRefundNum,displayInfo.complaints.danger=+a.indVal-+a.localVal<=0?!0:!1,displayInfo.complaints.localVal=a.localVal,displayInfo.punish.punishCount=o.punishCount,displayInfo.punish.cPunishTimes=o.cPunishTimes,displayInfo.punish.danger=+o.indVal-+o.localVal<0?!0:!1,displayInfo.punish.localVal=o.localVal,sendToContent()}),sendRequest(r,function(n){displayInfo.allBadCommentList=[],n=new Function("function shop_rate_list(obj){return obj};return "+n.trim())(),displayInfo.allBadCommentList=n.rateListDetail&&badCommentRefine(n.rateListDetail),sendToContent()})}function badCommentRefine(n){for(var e=n.length,t=[],a=0;e>a;a++){var o={},i=n[a];o.auctionPrice=i.auction.auctionPrice,o.title=i.auction.title,o.sku=i.auction.sku,o.date=i.date,o.content=i.content,o.name=i.user.nick+(JSON.parse(i.user.anony)?"(匿名)":""),o.rank=i.user.rank,o.vipLevel=i.user.vipLevel,o.appendContent=i.append&&i.append.content,t.push(o)}return t}var apiGroup={},infoGroup={},displayInfo={},h=0,finalNum=0;chrome.extension.onRequest.addListener(function(n){switch(n.cmd){case"get-basicInfo":h=0,apiGroup=n,infoGroup.commentList=[],infoGroup.normalCommentList=[],infoGroup.tradeDetailList=[],displayInfo.successRate="",displayInfo.badCommentList=[],function(){for(var n=1;6>n;n++)sendRequest(apiGroup.dataListApi+"&callback=jsonp_reviews_list&currentPageNum="+n,function(n){dataCollection(n,infoGroup.commentList)}),sendRequest(apiGroup.dataApi.replace(/&bid_page=[0-9]*/,"")+"&callback=__jsonp_records_reload&bid_page="+n,function(n){dataCollection(n,infoGroup.tradeDetailList)})}(),sendRequest(apiGroup.dataListApi+"&callback=jsonp_reviews_list&currentPageNum=1&rateType=0",function(n){dataCollection(n,infoGroup.normalCommentList)}),sendRequest(apiGroup.dataListApi+"&callback=jsonp_reviews_list&currentPageNum=1&rateType=-1",function(n){dataCollection(n,displayInfo.badCommentList)}),sendRequest(apiGroup.apiItemInfo,function(n){dataCollection(n,displayInfo.successRate)}),sendRequest(apiGroup.dataRateUrl,shopInfoBundle)}});