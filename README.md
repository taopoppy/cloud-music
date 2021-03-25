# cloud-music
使用react全家桶来做一个网易云的官网

我们发现有一个线上版本`https://musicapi.leanapp.cn/`，然后测试发现可以登录，在通过手机登录后返回的`cookie`拿到手后，其他需要登录的接口可以在接口后面添加`?cookie=xxxxx`的方式去拿到数据。