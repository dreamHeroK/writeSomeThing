uniapp 华为应用市场权限说明解决方案,在使用需要权限的功能前，先进行权限判断，使用`uni.createRequestPermissionListener()` 开启监听，因为这个监听是监听所有的权限弹窗，所以需要知道当前是拉起的什么权限弹窗。

下面是vuex代码,涉及到读取手机状态，拨打电话权限，读取相册，拉起相机，读取存储，获取定位，保存文件等权限，更多权限可以自定义。
下面是权限列表

|权限名称|	说明|
| ----------- | ----------- |
|android.permission.WRITE_USER_DICTIONARY	|允许应用程序向用户词典中写入新词|
|android.permission.WRITE_SYNC_SETTINGS	|写入 Google 在线同步设置|
|android.permission.WRITE_SOCIAL_STREAM |读取用户的社交信息流
|android.permission.WRITE_SMS |允许程序写短信
|android.permission.WRITE_SETTINGS |允许程序读取或写入系统设置
|android.permission.WRITE_SECURE_SETTINGS |允许应用程序读取或写入安全系统设置
|android.permission.WRITE_PROFILE |允许程序写入个人资料数据
|android.browser.permission.WRITE_HISTORY_BOOKMARKS |允许一个应用程序写(但不可读)用户的浏览历史和书签
|android.permission.WRITE_GSERVICES |允许程序修改 Google 服务地图
|android.permission.WRITE_EXTERNAL_STORAGE |允许程序写入外部存储,如 SD 卡上写文件
|android.permission.WRITE_CONTACTS	写入联系人,但不可读取
|android.permission.WRITE_CALL_LOG |允许程序写入（但是不能读）用户的联系人数据
|android.permission.WRITE_CALENDAR |允许程序写入日程，但不可读取
|android.permission.WRITE_APN_SETTINGS |允许程序写入网络 GPRS 接入点设置
|android.permission.WAKE_LOCK |允许程序在手机屏幕关闭后后台进程仍然运行
|android.permission.VIBRATE |允许程序振动
|android.permission.USE_SIP |允许程序使用 SIP 视频服务
|android.permission.USE_CREDENTIALS |允许程序请求验证从 AccountManager
|android.permission.UPDATE_DEVICE_STATS |允许程序更新设备状态
|android.launcher.permission.UNINSTALL_SHORTCUT	删除快捷方式
|android.permission.TRANSMIT_IR |允许使用设备的红外发射器，如果可用
|android.permission.SYSTEM_ALERT_WINDOW |允许程序显示系统窗口
|android.permission.SUBSCRIBED_FEEDS_WRITE |允许程序写入或修改订阅内容的数据库
|android.permission.SUBSCRIBED_FEEDS_READ |允许程序访问订阅信息的数据库
|android.permission.STATUS_BAR |允许程序打开、关闭、禁用状态栏
|android.permission.SIGNAL_PERSISTENT_PROCESSES |允许程序发送一个永久的进程信号，已废弃
|android.permission.SET_WALLPAPER_HINTS |允许程序设置壁纸建议
|android.permission.SET_WALLPAPER |允许程序设置桌面壁纸
|android.permission.SET_TIME_ZONE |允许程序设置系统时区
|android.permission.SET_TIME |允许程序设置系统时间
|android.permission.SET_PROCESS_LIMIT |允许程序设置最大的进程数量的限制
|android.permission.SET_PREFERRED_APPLICATIONS |允许程序设置应用的参数，已不再工作具体查看 addPackageToPreferred(String) 介绍
|android.permission.SET_POINTER_SPEED	|无法被第三方应用获得，系统权限
|android.permission.SET_ORIENTATION |允许程序设置屏幕方向为横屏或标准方式显示，不用于普通应用
|android.permission.SET_DEBUG_APP |允许程序设置调试程序，一般用于开发
|android.permission.SET_ANIMATION_SCALE |允许程序设置全局动画缩放
|android.permission.SET_ALWAYS_FINISH |允许程序设置程序在后台是否总是退出
|android.alarm.permission.SET_ALARM |允许程序设置闹铃提醒
|android.permission.SET_ACTIVITY_WATCHER |允许程序设置 Activity 观察器一般用于 monkey 测试
|android.permission.SEND_SMS |允许程序发送短信
|android.permission.SEND_RESPOND_VIA_MESSAGE |允许用户在来电的时候用你的应用进行即时的短信息回复。
|android.permission.RESTART_PACKAGES |允许程序结束任务通过 restartPackage(String)方法，该方式将在外来放弃
|android.permission.REORDER_TASKS |允许程序重新排序系统 Z 轴运行中的任务
|android.permission.RECORD_AUDIO |允许程序录制声音通过手机或耳机的麦克
|android.permission.RECEIVE_WAP_PUSH |允许程序接收 WAP PUSH 信息
|android.permission.RECEIVE_SMS |允许程序接收短信
|android.permission.RECEIVE_MMS |允许程序接收彩信
|android.permission.RECEIVE_BOOT_COMPLETED |允许程序开机自动运行
|android.permission.REBOOT |允许程序重新启动设备
|android.permission.READ_USER_DICTIONARY	|从一个提供器中获取数据，针对对应的提供器，应用程序需要“读访问权限”
|android.permission.READ_SYNC_STATS |允许程序读取同步状态，获得 Google 在线同步状态
|android.permission.READ_SYNC_SETTINGS |允许程序读取同步设置，读取 Google 在线同步设置
|android.permission.READ_SOCIAL_STREAM |读取用户的社交信息流
|android.permission.READ_SMS |允许程序读取短信内容
|android.permission.READ_PROFILE	|访问用户个人资料
|android.permission.READ_PHONE_STATE |允许程序访问电话状态
|android.permission.READ_LOGS |允许程序读取系统底层日志
|android.permission.READ_INPUT_STATE |允许程序读取当前键的输入状态，仅用于系统
|android.browser.permission.READ_HISTORY_BOOKMARKS |允许程序读取浏览器收藏夹和历史记录
|android.permission.READ_FRAME_BUFFER |允许程序读取帧缓存用于屏幕截图
|android.permission.READ_EXTERNAL_STORAGE	|程序可以读取设备外部存储空间（内置 SDcard 和外置 SDCard）的文件，如果您的 App 已经添加了“WRITE_EXTERNAL_STORAGE ”权限 ，则就没必要添加读的权限了，写权限已经包含了读权限了。
|android.permission.READ_CONTACTS |允许程序访问联系人通讯录信息
|android.permission.READ_CALL_LOG |读取通话记录
|android.permission.READ_CALENDAR |允许程序读取用户的日程信息
|android.permission.PROCESS_OUTGOING_CALLS |允许程序监视，修改或放弃播出电话
|android.permission.PERSISTENT_ACTIVITY |允许程序创建一个永久的 Activity，该功能标记为将来将被移除
|android.permission.NFC |允许程序执行 NFC 近距离通讯操作，用于移动支持
|android.permission.MOUNT_UNMOUNT_FILESYSTEMS |允许程序挂载、反挂载外部文件系统
|android.permission.MOUNT_FORMAT_FILESYSTEMS |允许程序格式化可移动文件系统，比如格式化清空 SD 卡
|android.permission.MODIFY_PHONE_STATE |允许程序修改电话状态，如飞行模式，但不包含替换系统拨号器界面
|android.permission.MODIFY_AUDIO_SETTINGS |允许程序修改声音设置信息
|android.permission.MEDIA_CONTENT_CONTROL |允许一个应用程序知道什么是播放和控制其内容。不被第三方应用使用。
|android.permission.MASTER_CLEAR |允许程序执行软格式化，删除系统配置信息
|android.permission.MANAGE_DOCUMENTS |允许一个应用程序来管理文档的访问，通常是一个文档选择器部分
|android.permission.MANAGE_APP_TOKENS	|管理创建、摧毁、Z 轴顺序，仅用于系统
|android.permission.MANAGE_ACCOUNTS |允许程序管理 AccountManager 中的账户列表
|android.permission.LOCATION_HARDWARE |允许一个应用程序中使用定位功能的硬件，不使用第三方应用
|android.permission.KILL_BACKGROUND_PROCESSES |允许程序调用 killBackgroundProcesses(String).方法结束后台进程
|android.permission.INTERNET |允许程序访问网络连接，可能产生 GPRS 流量
|android.permission.INTERNAL_SYSTEM_WINDOW |允许程序打开内部窗口，不对第三方应用程序开放此权限
|android.launcher.permission.INSTALL_SHORTCUT	|创建快捷方式
|android.permission.INSTALL_PACKAGES |允许程序安装应用
|android.permission.INSTALL_LOCATION_PROVIDER |允许程序安装定位提供
|android.permission.INJECT_EVENTS |允许程序访问本程序的底层事件，获取按键、轨迹球的事件流
|android.permission.HARDWARE_TEST |允许程序访问硬件辅助设备，用于硬件测试
|android.permission.GLOBAL_SEARCH |允许程序允许全局搜索
|android.permission.GET_TOP_ACTIVITY_INFO |允许一个应用程序检索私有信息是当前最顶级的活动，不被第三方应用使用
|android.permission.GET_TASKS |允许程序获取任务信息
|android.permission.GET_PACKAGE_SIZE |允许程序获取应用的文件大小
|android.permission.GET_ACCOUNTS |允许程序访问账户 Gmail 列表
|android.permission.FORCE_BACK |允许程序强制使用 back 后退按键，无论 Activity 是否在顶层
|android.permission.FLASHLIGHT |允许访问闪光灯
|android.permission.FACTORY_TEST |允许程序运行工厂测试模式
|android.permission.EXPAND_STATUS_BAR |允许程序扩展或收缩状态栏
|android.permission.DUMP |允许程序获取系统 dump 信息从系统服务
|android.permission.DISABLE_KEYGUARD |允许程序禁用键盘锁
|android.permission.DIAGNOSTIC |允许程序到 RW 到诊断资源
|android.permission.DEVICE_POWER |允许程序访问底层电源管理
|android.permission.DELETE_PACKAGES |允许程序删除应用
|android.permission.DELETE_CACHE_FILES |允许程序删除缓存文件
|android.permission.CONTROL_LOCATION_UPDATES |允许程序获得移动网络定位信息改变
|android.permission.CLEAR_APP_USER_DATA |允许程序清除用户数据
|android.permission.CLEAR_APP_CACHE |允许程序清除应用缓存
|android.permission.CHANGE_WIFI_STATE |允许程序改变 WiFi 状态
|android.permission.CHANGE_WIFI_MULTICAST_STATE |允许程序改变 WiFi 多播状态
|android.permission.CHANGE_NETWORK_STATE |允许程序改变网络状态,如是否联网
|android.permission.CHANGE_CONFIGURATION |允许当前应用改变配置，如定位
|android.permission.CHANGE_COMPONENT_ENABLED_STATE	改变组件是否启用状态
|android.permission.CAPTURE_VIDEO_OUTPUT |允许一个应用程序捕获视频输出，不被第三方应用使用
|android.permission.CAPTURE_SECURE_VIDEO_OUTPUT |允许一个应用程序捕获视频输出。不被第三方应用使用
|android.permission.CAPTURE_AUDIO_OUTPUT |允许一个应用程序捕获音频输出。不被第三方应用使用
|android.permission.CAMERA |允许程序访问摄像头进行拍照
|android.permission.CALL_PRIVILEGED |允许程序拨打电话，替换系统的拨号器界面
|android.permission.CALL_PHONE |允许程序从非系统拨号器里拨打电话
|android.permission.BROADCAST_WAP_PUSH	WAP PUSH 服务收到后触发一个广播
|android.permission.BROADCAST_STICKY |允许程序收到广播后快速收到下一个广播
|android.permission.BROADCAST_SMS |允许程序当收到短信时触发一个广播
|android.permission.BROADCAST_PACKAGE_REMOVED |允许程序删除时广播
|android.permission.BRICK	|能够禁用手机，非常危险，顾名思义就是让手机变成砖头
|android.permission.BLUETOOTH_PRIVILEGED |允许应用程序配对蓝牙设备，而无需用户交互
|android.permission.BLUETOOTH_ADMIN |允许程序进行发现和配对新的蓝牙设备
|android.permission.BLUETOOTH |允许程序连接配对过的蓝牙设备
|android.permission.BLUETOOTH_SCAN	|Android12 的蓝牙权限 如果您的应用查找蓝牙设备（如蓝牙低功耗 (BLE) 外围设备）
|android.permission.BLUETOOTH_CONNECT	|Android12 的蓝牙权限 如果您的应用与已配对的蓝牙设备通信或者获取当前手机蓝牙是否打开
|android.permission.BIND_WALLPAPER	|必须通过 WallpaperService 服务来请求，只有系统才能用
|android.permission.BIND_VPN_SERVICE	|绑定 VPN 服务必须通过 VpnService 服务来请求,只有系统才能用
|android.permission.BIND_TEXT_SERVICE	|必须要求 textservice(例如吗 spellcheckerservice)，以确保只有系统可以绑定到它。
|android.permission.BIND_REMOTEVIEWS	|必须通过 RemoteViewsService 服务来请求，只有系统才能用
|android.permission.BIND_PRINT_SERVICE	|必须要求由 printservice，以确保只有系统可以绑定到它。
|android.permission.BIND_NOTIFICATION_LISTENER_SERVICE	|必须要求由 notificationlistenerservice，以确保只有系统可以绑定到它。
|android.permission.BIND_NFC_SERVICE	|由 hostapduservice 或 offhostapduservice 必须确保只有系统可以绑定到它。
|android.permission.BIND_INPUT_METHOD	|请求 InputMethodService 服务，只有系统才能使用
|android.permission.BIND_DEVICE_ADMIN	|请求系统管理员接收者 receiver，只有系统才能使用
|android.permission.BIND_APPWIDGET |允许程序告诉 appWidget 服务需要访问小插件的数据库，只有非常少的应用才用到此权限
|android.permission.BIND_ACCESSIBILITY_SERVICE	|请求 accessibilityservice 服务，以确保只有系统可以绑定到它。
|android.permission.AUTHENTICATE_ACCOUNTS |允许程序通过账户验证方式访问账户管理 ACCOUNT_MANAGER 相关信息
|android.voicemail.permission.ADD_VOICEMAIL |允许一个应用程序添加语音邮件系统
|android.permission.ACCOUNT_MANAGER |允许程序获取账户验证信息，主要为 GMail 账户信息，只有系统级进程才能访问的权限
|android.permission.ACCESS_WIFI_STATE |允许程序获取当前 WiFi 接入的状态以及 WLAN 热点的信息
|android.permission.ACCESS_SURFACE_FLINGER	Android 平台上底层的图形显示支持，一般用于游戏或照相机预览界面和底层模式的屏幕截图
|android.permission.ACCESS_NETWORK_STATE |允许程序获取网络信息状态，如当前的网络连接是否有效
|android.permission.ACCESS_MOCK_LOCATION |允许程序获取模拟定位信息，一般用于帮助开发者调试应用
|android.permission.ACCESS_LOCATION_EXTRA_COMMANDS |允许程序访问额外的定位提供者指令
|android.permission.ACCESS_FINE_LOCATION |允许程序通过 GPS 芯片接收卫星的定位信息
|android.permission.ACCESS_COARSE_LOCATION |允许程序通过 WiFi 或移动基站的方式获取用户错略的经纬度信息
|android.permission.ACCESS_CHECKIN_PROPERTIES |允许程序读取或写入登记 check-in 数据库属性表的权限
```
const state = {
  dialogView: null,
  //   permissionListener: null,
  list: [
    {
      name: 'READ_CALENDAR',
      title: '手机状态权限申请说明:',
      content: 'uni-app正在申请手机日历日历状态权限,允许或拒绝均不会获取任何隐私信息。'
    },
    {
      name: 'CALL_PHONE',
      title: '拨打电话权限申请说明:',
      content: 'uni-app正在申请拨打电话权限,允许或拒绝均不会获取任何隐私信息。'
    },
    {
      name: 'CAMERA',
      title: '读取存储权限申请说明:',
      content: 'uni-app正在申请摄像头权限,允许或拒绝均不会获取任何隐私信息。'
    },
    {
      name: 'READ_EXTERNAL_STORAGE',
      title: '读取存储权限申请说明:',
      content: 'app正在申请读取存储权限,允许或拒绝均不会获取任何隐私信息。'
    },
    {
      name: 'ACCESS_FINE_LOCATION',
      title: '获取定位权限申请说明:',
      content: 'app正在申请获取定位权限,允许或拒绝均不会获取任何隐私信息。'
    },
    {
      name: 'WRITE_EXTERNAL_STORAGE',
      title: '保存文件权限申请说明:',
      content: 'app正在申请保存文件权限,允许或拒绝均不会获取任何隐私信息。'
    }
  ]
};
const actions = {
  //监听权限申请
  async requestPermission({ state, dispatch }, { permissionID, content }) {
    return new Promise((resolve, reject) => {
      try {
        console.log(uni.getSystemInfoSync(), 'uni.getSystemInfoSync().platfor');
        if (uni.getSystemInfoSync().platform !== 'android') {
          return resolve(true);
        }
        /**
         * @description plus.navigator.checkPermission 检查应用是否获取指定权限
         * 有些权限检测不到 就继续下面的代码，比如相册权限就可以直接检测，就很方便，授权情况下不需要再走下面代码了
         * checkPermission 返回参数
         * @params undetermined 未确定
         * @params authorized 授权
         */
        let checkPermission = plus.navigator.checkPermission('android.permission.' + permissionID);
        if (checkPermission == 'authorized') return resolve(true);
        //判断是否自己在list里面配置了这个权限
        let index = state.list.findIndex((item) => item.name == permissionID);
        if (index == -1) throw new Error('这个权限没有配置');
        //唤起原生权限说明弹框
        dispatch('requestPermissionDialog', { index, content });
        //授权检测回调
        plus.android.requestPermissions(
          [
            'android.permission.' + permissionID //单个权限
            // 'android.permission.CAMERA', 'android.permission.READ_EXTERNAL_STORAGE'  //多个权限
          ],
          (resultObj) => {
            console.log(resultObj, 'resultObj');
            // 权限申请结果
            /**
             * @description resultObj.deniedAlways 永久拒绝授权
             * 多个权限返回结果可能是{"granted":["android.permission.CAMERA"],"deniedPresent":[],"deniedAlways":["android.permission.READ_EXTERNAL_STORAGE"]}
             * 这个情况就是我同时授权相册和相机，但是只允许了相机，没有授权相册
             * 这个时候 可以通过deniedAlways 查看哪个权限被永久拒绝了，然后自行在设置弹框内容
             * 所以可以自己判断细分一下，我下面的代码是先判断了是否有永久拒绝的权限，然后直接弹框提示用户去设置
             */
            if (resultObj.deniedAlways && resultObj.deniedAlways.length > 0) {
              uni.showModal({
                title: '提示',
                content: '操作权限已被拒绝，请手动前往设置',
                confirmText: '立即设置',
                success: (res) => {
                  if (res.confirm) {
                    dispatch('gotoAppPermissionSetting');
                  } else {
                    resolve(false);
                  }
                }
              });
              console.log('永久拒绝授权');
            } else if (resultObj.deniedPresent && resultObj.deniedPresent.length > 0) {
              resolve(false);
              console.log('拒绝授权');
            } else if (resultObj.granted && resultObj.granted.length > 0) {
              resolve(true);
              console.log('授权成功');
            }
          },
          (error) => {
            reject(false);
            console.log('申请权限错误：', error);
          }
        );
      } catch (err) {
        reject(false);
        console.log(err);
      }
    });
  },
  //监听弹框
  requestPermissionDialog({ state, dispatch, commit }, { index, content }) {
    try {
      console.log('state.permissionListener', state.permissionListener);
      if (!state.permissionListener) {
        commit('SET_LISTENER', uni.createRequestPermissionListener());
      }
      const dialogData = state.list[index];
      if (content) {
        dialogData = JONS.parse(JSON.stringify({ ...dialogData, content }));
      }
      state.permissionListener.onConfirm((res) => {
        dispatch('dialogStyle', { dialogData, status: true });
      });
      state.permissionListener.onComplete(async (res) => {
        dispatch('dialogStyle', { dialogData: {}, status: false });
      });
    } catch (err) {
      console.log('监听弹框错误', err);
    }
  },
  //弹框样式
  dialogStyle({ state }, { dialogData, status }) {
    try {
      console.log('dialogStyle');
      if (!status) return state.dialogView.close();
      const systemInfo = uni.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;
      const navigationBarHeight = systemInfo.platform === 'android' ? 48 : 44;
      const totalHeight = statusBarHeight + navigationBarHeight;
      state.dialogView = new plus.nativeObj.View('per-modal', {
        top: '0px',
        left: '0px',
        width: '100%',
        backgroundColor: '#444'
        //opacity: .5;
      });
      state.dialogView.drawRect(
        {
          color: '#fff',
          radius: '5px'
        },
        {
          top: totalHeight + 'px',
          left: '5%',
          width: '90%',
          height: '100px'
        }
      );
      state.dialogView.drawText(
        dialogData.title,
        {
          top: totalHeight + 5 + 'px',
          left: '8%',
          height: '30px'
        },
        {
          align: 'left',
          color: '#000'
        }
      );
      state.dialogView.drawText(
        dialogData.content,
        {
          top: totalHeight + 35 + 'px',
          height: '60px',
          left: '8%',
          width: '84%'
        },
        {
          whiteSpace: 'normal',
          size: '14px',
          align: 'left',
          color: '#656563'
        }
      );
      state.dialogView.show();
    } catch (e) {
      console.log(e, '权限说明弹框样式错误');
    }
  },
  //跳转到app权限设置页面
  gotoAppPermissionSetting() {
    if (!uni.getSystemInfoSync().platform == 'android') {
      var UIApplication = plus.ios.import('UIApplication');
      var application2 = UIApplication.sharedApplication();
      var NSURL2 = plus.ios.import('NSURL');
      // var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");
      var setting2 = NSURL2.URLWithString('app-settings:');
      application2.openURL(setting2);

      plus.ios.deleteObject(setting2);
      plus.ios.deleteObject(NSURL2);
      plus.ios.deleteObject(application2);
    } else {
      // console.log(plus.device.vendor);
      var Intent = plus.android.importClass('android.content.Intent');
      var Settings = plus.android.importClass('android.provider.Settings');
      var Uri = plus.android.importClass('android.net.Uri');
      var mainActivity = plus.android.runtimeMainActivity();
      var intent = new Intent();
      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      var uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
      intent.setData(uri);
      mainActivity.startActivity(intent);
    }
  }
};

const mutations = {
  SET_LISTENER(state, value) {
    state.permissionListener = value;
  }
};
export default {
  state,
  actions,
  mutations
};

```
在项目中使用
```
if (!(await this.requestPermission({ permissionID: 'ACCESS_FINE_LOCATION' }))) return;
uni.getLocation()
```