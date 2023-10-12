export const UserStatusEnum: { [name: string]: any } = {
  'USED': 0,
  'UNUSED': 1,
  '0': '正常', // 启用
  '1': '停用', // 停用
};

export const UserStatusList = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '正常',
    value: 0,
  },
  {
    label: '停用',
    value: 1,
  },
];

export const BindHdlStatusEnum: { [name: string]: any } = {
  'YES': 1,
  'NO': 0,
  '0': '未绑定', // 未绑定
  '1': '已绑定',
};

export const BindHdlStatusList = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '未绑定',
    value: 0,
  },
  {
    label: '已绑定',
    value: 1,
  },
];

export const PublishStatusEnum: { [name: string]: any } = {
  'PUBED': 1,
  'UNPUBED': 0,
  '0': '未发布', //
  '1': '已发布', //
};

export const MetaStatusList = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '未发布',
    value: 0,
  },
  {
    label: '已发布',
    value: 1,
  },
];
