## 模板介绍

首页是两行布局，第一行是查询条件、第二行是 table

### 文件介绍

- `./components/detail-drawer.vue`: 详情展示，包括一个编辑按钮，`符合有操作的 drawer 不允许点击 mask 关闭`规范
- `./components/edit-modal-fullscreen.vue`: 全屏 modal，注意全局类`class="fullscreen-modal"`不能删除，控制着全屏 modal 的样式
- `./components/edit-modal.vue`: 弹窗 modal， 新增、编辑使用同一个 modal

### table 中功能

- drawer 详情展示，包括一个编辑按钮，有操作的 drawer 不允许点击 mask 关闭
- modal 类删除，即点击`删除`，弹窗`modal`进行二次确认；
- popconfirm 类删除，即点击`删除`，使用 `popconfirm`进行二次确认
