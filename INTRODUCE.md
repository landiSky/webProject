<div>
基于tele-design-vue(v2.36) + vue3 + vite 的web 端项目模板代码，用于初始化前端项目，提高开发效率。
[项目模板介绍](./INTRODUCE.md)
</div>

## api 使用
是对 [axios](https://axios-http.com/zh/docs/intro) 的简单封装, 没有改变使用方式。
区别是在 config 配置里添加了一个自定义入参字段**customFields**

```typescript
 customFields?: {
      withoutToken?: boolean; // 请求接口中的header 是否携带 token，默认 false，携带 token
      returnRawResponse?: boolean; // 业务方直接处理原始 response
      returnRawData?: boolean; // 业务方直接处理原始 data，自定义报错格式时，可传 true
    };
```

## mock 数据
1. 确认与后端协商的 json 格式，修改`src/mock/response.ts`中的成功、失败json 格式
2. 在`src/mock`下增加对应模块的接口 Mock 文件 xx.ts
3. 在`src/mock`中，引入 xx.ts

## 自定义图标图
项目使用的组件库是基于 [arco-design](https://arco.design/vue/docs/start) 封装的 [tele-design-vue](http://tele-design-vue.prod.idx.space/vue/docs/start)，
[iconpark-icon](https://bytedance.feishu.cn/wiki/wikcnrOVHCJQ4V3a7mDvmLjrePf)

- 存放 js 文件路径：`src/assets/icon-park/icon.js`

```js
//name: 是上传图标时， 定义的图标名称
<iconpark-icon name="logo-white" size="16px"></iconpark-icon>
```

## 路由、按钮权限控制
- 路由、按钮权限： 在文件`src/enums/authEnum.ts`中添加枚举值
```typescript
BaseRouteAuth = {path: authCode}
BaseButtonAuth = {BTN_USER_ADD: 'BTN_USER_ADD'}

// 应用
<t-button v-has="$authCode.BTN_USER_ADD">新建用户</t-button>
 ```


## pre-commit 格式校验
在`.husky/pre-push`中对提交代码做了 tsc 编译校验，避免强提交编译未通过的代码，只针对**develop**上的代码提交，可以根据项目需求开关

## zadig 部署
在 zadig 上的部署配置文件`./deployment`，具体部署方法参考[zadig 部署](https://alidocs.dingtalk.com/i/nodes/KGZLxjv9VG37Lk2RsXKm0Kw0V6EDybno?iframeQuery=utm_source%3Dportal%26utm_medium%3Dportal_recent)
- Dockerfile: 部署web 静态资源的 nginx 镜像
- nginx.conf: 定义 api 接口转发的后端服务，覆盖 nginx 镜像的默认配置


## 注意
.npmrc中设置的源是公司内的`nexus.teleinfo.cn`,如果安装过程中出现问题，可以先尝试替换为其他源重试，但在 zadig 部署时，需要使用公司源