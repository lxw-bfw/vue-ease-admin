<h1>vue-ease-admin</h1>

![GitHub license](https://img.shields.io/github/license/pure-admin/vue-pure-admin?style=flat)forks](https://img.shields.io/github/forks/pure-admin/vue-pure-admin?style=flat)

## 简介

`vue-ease-admin` 是一款基于开源免费且开箱即用的优秀中后台管理系统模版——[vue-pure-admin](https://github.com/pure-admin/vue-pure-admin/tree/main)进行抽离、定制和扩展的`CMS`系统模板，助力于快速开发个人或企业的中小规模`CMS`系统前端功能。对`vue`尤其是`vue3`比较熟悉的小伙伴可以直接克隆后快速上手，也可以直接去了解著名的`vue-pure-admin`项目。

项目 完全采用 `ECMAScript` 模块（`ESM`）规范来编写和组织代码，使用了最新的 `Vue3`、`Vite`、`Element-Plus`、`TypeScript`、`Pinia`、`Tailwindcss` 等主流技术开发。

项目中，针对`http`请求封装库，我这边做了修改，不依赖安装外部库，底层是基于`fetch + await`模式进行封装，同样提供了请求拦截和响应拦截，相对依赖外部库更轻量一点（原项目是基于`axios`二次封装和提供用于业务代码的`http`请求工具函数）



## 基于`fetch + await`模式封装的`fetch.ts`

### 特性

- 支持通过参数自定义全部`fetch options`配置

  ```typescript
  export type FetchHttpRequestUserConfig = {
    url?: string;
    method?: RequestMethods;
    params?: object;
    headers?: object;
    credentials?: RequestCredentials;
    signal?: AbortSignal;
    timeOut?:number
  };

  export type ExtraUserConfig = Omit<
    RequestInit,
    "method" | "body" | "headers" | "credentials" | "signal"
  >;
  ```

- 支持从接口调用业务逻辑代码处进行手动中断请求

- 支持超时处理，默认10s

- 内部处理请求拦截`httpInterceptorsRequest`和响应拦截`httpInterceptorsResponse`

- 实现无感刷新token相关验证

- 基于 `await` 和 `promis resolve`，在`access token`过期过程中暂存其他已经进入的接口，等待`刷新 token`成功后再进行调用

- 提供通用请求工具函数

  ```typescript
  // request方法
  return fetchHttp.request<UserResult>("post", "/login", { params: data });
  ```

- 根据请求方式，单独抽离的请求工具函数

  ```typescript
  // 比如get请求
  fetchHttp.post('/add',{params: data})
  ```

## 权限开发

### 简述

访问控制也就是权限验证功能几乎是每一个管理系统也就是后台项目必须的功能，可以说是一个管理系统项目一开始就必须考虑和搭建的基础核心功能。遵循原项目，系统的权限控制方案采用的是`RBAC`模式，，也就是基于角色的访问控制，这是一种广泛采用的权限控制方案。系统中定义了不同的角色，每个角色具有一组权限，而用户被分配到一个或多个角色。通过控制用户角色的分配，可以实现对用户访问系统中不同功能和资源的权限控制。

### 集成

#### 权限模块

本工程将`cms`系统划分为两大模块，模块一就是系统管理也可以称为用户管理；模块二是内容管理，也就开发此`cms`系统的真正目的，内容管理是灵活的，是根据经营业务等来定的。而系统管理模块涉及的功能如`权限模块，涉及用户-角色-权限三个模块`、`cms系统用户个人账户设置`等往往是可以可以通用类似的，也就是方便抽离设计。

##### 原本的

遵循原本的权限设计逻辑，同时集成了系统管理下的`用户`、`角色`和`菜单（权限）`管理三个页面，保留了相关的`mock`接口方便快速上手。项目设计了两种粒度的权限，一种是页面级别的权限还有一种是细化到页面按钮和其他功能的小粒度权限。

其中页面级别的权限，是基于用户所被分配的**角色标识符数组**来划分的。根据每一个路由所需要的角色标识符，以及用户拥有的角色标识符进行校验和过滤，最终得到用户有权访问的路由菜单。在全局路由守卫会进一步进行校验和拦截。

更细粒度的权限如按钮级别的权限，则需要依附一个页面，也就是创建它们需要关联一个有效的菜单页面，通过给当前登录用户的路由页面提供诸如编辑、创建和删除等权限标识符，然后可以封装通用的校验方法，再进一步封装成指令和组件进行使用。

##### 扩展和未来的想法

> 原项目中，用户可以有那些路由页面访问权限更多是控制在前端，也就是不论当前登录的是哪个用户，都会从后台那里获取到当前系统全部的路由菜单，后再根据涉及用户角色相关的字段进行过滤。
>
> 根据以往的后台管理系统开发经验，我这边会减少放在前端这边的处理，对于用户可以访问那些路由菜单页面信息，统一后台这边处理后返回需要的路由配置信息。然后前端进行处理后再动态地去注册路由，和生成侧边栏菜单。这样即使用户无意间在地址栏输入了一个无权限的页面访问地址，因为没有注册，也会直接跳到404。

> 增加接口权限校验模式，对于系统中重要的资源接口，增加一层权限校验，也就是只有被分配了这些接口角色的拥有者才有权限访问这些接口，否则返回401状态码和code码进一步区分。后端可以增加相关处理业务和对应的拦截器，前端可以在权限功能中增加接口权限分配功能，可以针对性在接口请求响应里面再做一层错误过滤。

#### 用户个人账户设置

集成了用户个人账户设置相关页面



## 安装使用

### 安装依赖

```bash
pnpm install
```

### 启动平台

```bash
pnpm dev
```

### 项目打包

```bash
pnpm build
```

##
