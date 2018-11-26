## 内网资料  
> \\TRONCELLNAS\SensingStore\99_其他\troncell
> \\TRONCELLNAS\SensingStore\20_需求设计\方案设计\v3版本    

## 阿里开放平台
> 涉及智慧购物屏全渠道智慧门店应用，白名单，api统计等      
* 账号 troncell_retail
* 密码 wulixu.514
* appkey 23492108
* secret 15eb4df38df0b913328730418b57b101

***
## 淘宝game项目手机页面
> 在taobaogame目录下，node acs/code/index启动项目
> 将code目录"下"所有内容打包为code.zip并上传（阿里开放平台=>服务管理=>开发运维=>node项目），会自动重启 
> 点击容器管理查看状态，若为运行中，即已重启成功，正常运行中

## 测试服务器/139.224.15.28
> 涉及game测试及部分项目，有完整的运行环境（iis+sql server+sdk）   
* 账号 administrator
* 密码 1qaz@WSXdb

## SensingStore项目启动流程
> (更新node到6.0以上版本)
> 拉取代码，npm install
> 获取个性化文件，解压进node_modules文件夹
> npm start
> localhost:4200
> 更新接口时：SensingStore\angular\nswag 先在config文件中改变对应接口的三个属性名，然后执行refresh.bat

## 小程序
> wulixu.william@gmail.com
> wulixu.514

## 我的小程序
> 15950593758@163.com

## 我的公众号
> tk624061283@sina.com

## 添加语言种类
看angular\node_modules\@angular\common\locales里对应的js名
新增时在config里把后端名后缀指向js前缀


## 如何设置版本和权限(只有版本和权限都符合时才能进入)
项目启动时查看getall接口,寻找feature和permission的值
版本:
src\app\shared\services\machine.service.ts 里面配置feature,key同src\app\shared\layout\nav\app-navigation.service.ts中的key
若不配置则默认所有版本都有

权限:
src\app\shared\layout\nav\app-navigation.service.ts里配置第二个参数要加permission的值(控制是否显示)
src\app\admin\admin-routing.module.ts对应router里也要加一个data{permission:值}(控制是否能通过路由进入)

## V3的demo
* 地址http://troncell.demo.aspnetzero.com/
* 账号admin
* 密码123456

## wifi密码:
* 1qaz@WSX

## 远程链接 WIN+R===>"mstsc"
* 地址139.196.240.230  端口号21
* 账号administrator 
* 密码1!hoster!1
* win10家庭版远程连接的问题https://blog.csdn.net/qq_16855093/article/details/80277651

139.224.15.28的139.224.42.130数据库(账号sa 密码1!troncell!1)
Troncell.SensingStore.Main=>Tables=>dbo.ExternalAccessTokenInfos=>accessToken(session)
taobaoOpenplatformId 1>智慧门店 3=>数字门店

## 老版本活动
* 地址http://game.troncell.com/Account/Login
* 账号troncell
* 密码1qaZ@WSX



cat log.log

https://nodejs.ews.m.jaeapp.com/?actionId=9168&status=Done&tenantName=Mark


micro-sql-manage=>zuf=>taobaoGameNew-table-users

拳击猫数据库
TaobaoGameNew=>Table=>UserAwards已中奖用户

delete from UserAwards
where Id = 10
execute


delete from UserAwards
where Id > 4

select * from UserAwards



## 资生堂小程序账号
* 账号 jbgw admin
* 密码 Tron@421


## 百度商家(统计)账号
* 账号 troncell
* 密码 5tgb6YHN


## 微信活动
* 原页面 https://g.api.troncell.com/wx/xxx.html
位于V3同平台下,/data/services/activity/publish/wwwroot
* 新页面 https://m.sensingstore.com/xxx.html
位于230服务器下,wxActivity内(通过mstsc进入即可)


## 创思感知文档
* http://docs.troncell.com/docs_html/index.html
* 位于230服务器下SensingDocs内
* 139.196.240.230
* administrator 1!hoster!1

## 加入新接口方法
1. nswag中新建文件service.config.nswag-xxx,并执行refresh.bat xxx xxx以及refresh.bat xxx r
2. service-proxy.module.ts中,import并providers
3. root.module.ts中,import并providers,其中需要新增getRemoteXXXServiceUrl的方法,并分别在
AppPreBootstrap.ts,appconfig.json,appconfig.production.json,AppConsts.ts中加入
remoteXXXServiceUrl


腾讯企业邮箱
lilingtao@troncell.com


## 京东站点(布置了一个V3)
* 114.67.83.171（公）
* administrator
* 1@Troncell@1
* https://jd.sensingstore.com
