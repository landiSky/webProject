import { successResponseWrap } from './response';

export default [
  {
    url: '/inventory/web/tag/treeByProductId',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          id: '1787760236464050176',
          name: '类型分组',
          children: [
            {
              id: '1788041390358401024',
              name: '标签一',
              hasChecked: true,
              tagCountByTag: null,
            },
            {
              id: '1788041390358401031',
              name: '标签二',
              tagCountByTag: null,
            },
          ],
        },
        {
          id: '1787762050190151680',
          name: '行业分组',
          children: [
            {
              id: '1788816357266165760',
              name: '金融',
              tagCountByTag: null,
            },
            {
              id: '1788816357266165761',
              name: '交通',
              hasChecked: true,
              tagCountByTag: null,
            },
            {
              id: '1788816357266165762',
              name: '餐饮',
              hasChecked: true,
              tagCountByTag: null,
            },
            {
              id: '1788816357266165763',
              name: '互联网',
              //   hasChecked: true,
              tagCountByTag: null,
            },
          ],
        },
      ]);
    },
  },
  {
    url: '/inventory/web/tag/getTagsByProductId',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          id: '1787760236464050176',
          name: '类型分组',
          children: [
            {
              id: '1788041390358401024',
              name: '标签一',
              tagCountByTag: null,
            },
          ],
        },
        {
          id: '1787762050190151680',
          name: '行业分组',
          children: [
            {
              id: '1788816357266165760',
              name: '金融',
              tagCountByTag: null,
            },
            {
              id: '1788816357266165763',
              name: '互联网',
              tagCountByTag: null,
            },
          ],
        },
      ]);
    },
  },
  {
    url: '/inventory/web/product/tag',
    method: 'post',
    response: () => {
      return successResponseWrap([]);
    },
  },
  {
    // 分组列表
    url: '/inventory/web/group/selectList',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          id: '1787762149846814720',
          name: '行1', // 分组名称
          type: 1, // 前台筛选
          remark: '',
          tagCountByGroup: 0, // 标签数
        },
        {
          id: '1787762050190151680',
          name: '行业分组',
          type: 1,
          remark: '',
          tagCountByGroup: 0,
        },
        {
          id: '1787760236464050176',
          name: '类型分组',
          type: 1,
          remark: '备注',
          tagCountByGroup: 0,
        },
        {
          id: '1787762149846814723',
          name: '行1', // 分组名称
          type: 1, // 前台筛选
          remark: '',
          tagCountByGroup: 0, // 标签数
        },
        {
          id: '17877620501901516675',
          name: '行业分组',
          type: 1,
          remark: '',
          tagCountByGroup: 0,
        },
        {
          id: '1787760236464050185',
          name: '类型分组',
          type: 1,
          remark: '备注',
          tagCountByGroup: 0,
        },
        {
          id: '1787762149846814709',
          name: '行1', // 分组名称
          type: 1, // 前台筛选
          remark: '',
          tagCountByGroup: 0, // 标签数
        },
        {
          id: '1787762050190151612',
          name: '行业分组',
          type: 1,
          remark: '',
          tagCountByGroup: 0,
        },
        {
          id: '1787760236464050144',
          name: '类型分组',
          type: 1,
          remark: '备注',
          tagCountByGroup: 0,
        },
        {
          id: '1787762149846814766',
          name: '行1', // 分组名称
          type: 1, // 前台筛选
          remark: '',
          tagCountByGroup: 0, // 标签数
        },
        {
          id: '1787762050190151677',
          name: '行业分组',
          type: 1,
          remark: '',
          tagCountByGroup: 0,
        },
        {
          id: '1787760236464050188',
          name: '类型分组',
          type: 1,
          remark: '备注',
          tagCountByGroup: 0,
        },
      ]);
    },
  },
  {
    // 分组标签列表
    url: '/inventory/web/tag/selectList',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          id: '1788041657850138624',
          name: '标签三', // 标签名称
          tagCountByTag: 0, // 打标商品数
        },
        {
          id: '1788041632701091840',
          name: '标签二',
          tagCountByTag: 0,
        },
        {
          id: '1788041390358401024',
          name: '标签一',
          tagCountByTag: 0,
        },
      ]);
    },
  },
  {
    // 前台筛选
    url: '/inventory/web/group/selectCountByType',
    method: 'get',
    response: () => {
      return {
        code: 200,
        traceId: null,
        success: true,
        data: 3,
        message: '操作成功',
        err: null,
      };
    },
  },
  {
    // 新增分组
    url: '/inventory/web/group/insert',
    method: 'post',
    response: successResponseWrap({
      traceId: null,
      code: 200,
      success: true,
      data: null,
      message: '操作成功',
      err: null,
    }),
  },
  {
    // 编辑分组
    url: '/inventory/web/group/update',
    method: 'post',
    response: successResponseWrap({
      traceId: null,
      code: 200,
      success: true,
      data: null,
      message: '操作成功',
      err: null,
    }),
  },
  {
    // 删除分组
    url: '/inventory/web/group/deleteById',
    method: 'get',
    response: successResponseWrap({
      traceId: null,
      code: 200,
      success: true,
      data: null,
      message: '操作成功',
      err: null,
    }),
  },
  {
    // 新增标签
    url: '/inventory/web/tag/insert',
    method: 'post',
    response: successResponseWrap({
      traceId: null,
      code: 200,
      success: true,
      data: null,
      message: '操作成功',
      err: null,
    }),
  },
  {
    // 编辑标签
    url: '/inventory/web/tag/update',
    method: 'post',
    response: successResponseWrap({
      traceId: null,
      code: 200,
      success: true,
      data: null,
      message: '操作成功',
      err: null,
    }),
  },
  {
    // 删除标签
    url: '/inventory/web/tag/deleteById',
    method: 'get',
    response: successResponseWrap({
      traceId: null,
      code: 200,
      success: true,
      data: null,
      message: '操作成功',
      err: null,
    }),
  },
];
