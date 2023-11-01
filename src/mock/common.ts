import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    url: '/web/product/type/tree',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          id: 22,
          name: '测得AA',
          parentId: 0,
          remark: null,
          children: [
            {
              id: 23,
              name: 'qweq',
              parentId: 22,
              remark: null,
              children: null,
            },
          ],
        },
        {
          id: 1,
          name: '咨询',
          parentId: 0,
          remark: '咨询一级分类',
          children: [
            {
              id: 2,
              name: '服务',
              parentId: 1,
              remark: '服务二级分类',
              children: null,
            },
            {
              id: 1390683308597248,
              name: 'ceshi分类',
              parentId: 1,
              remark: '',
              children: null,
            },
            {
              id: 1390809808281600,
              name: 'ceshi分类',
              parentId: 1,
              remark: '备注',
              children: null,
            },
            {
              id: 1390809835454464,
              name: 'ceshi分类',
              parentId: 1,
              remark: '备注',
              children: null,
            },
            {
              id: 1390809954607104,
              name: 'ceshi分类',
              parentId: 1,
              remark: '备注',
              children: null,
            },
          ],
        },
        {
          id: 3,
          name: '解决方案',
          parentId: 0,
          remark: '解决方案一级分类',
          children: [
            {
              id: 4,
              name: '金融科技',
              parentId: 3,
              remark: '金融科技二级分类',
              children: null,
            },
            {
              id: 5,
              name: '社会治理',
              parentId: 3,
              remark: '社会治理二级分类',
              children: null,
            },
            {
              id: 6,
              name: '数字资产',
              parentId: 3,
              remark: '数字资产二级分类',
              children: null,
            },
            {
              id: 7,
              name: '工业大脑',
              parentId: 3,
              remark: '工业大脑二级分类',
              children: null,
            },
            {
              id: 8,
              name: '数字工厂',
              parentId: 3,
              remark: '数字工厂二级分类',
              children: null,
            },
          ],
        },
        {
          id: 9,
          name: '软件',
          parentId: 0,
          remark: '软件一级分类',
          children: [
            {
              id: 10,
              name: '平台类',
              parentId: 9,
              remark: '平台类二级分类',
              children: null,
            },
            {
              id: 11,
              name: '应用类',
              parentId: 9,
              remark: '应用类二级分类',
              children: null,
            },
          ],
        },
        {
          id: 12,
          name: '硬件',
          parentId: 0,
          remark: '硬件一级分类',
          children: [
            {
              id: 13,
              name: '芯片/模组',
              parentId: 12,
              remark: '芯片/模组二级分类',
              children: null,
            },
            {
              id: 14,
              name: '服务器产品',
              parentId: 12,
              remark: '服务器产品二级分类',
              children: null,
            },
            {
              id: 15,
              name: '智能硬件',
              parentId: 12,
              remark: '智能硬件二级分类',
              children: null,
            },
          ],
        },
      ]);
    },
  },
  {
    url: '/web/member/getCompanyMember',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          username: '张三',
          memberId: '1',
        },
        {
          username: '李斯',
          memberId: '2',
        },
        {
          username: '王武',
          memberId: '3',
        },
        {
          username: '赵柳',
          memberId: '4',
        },
      ]);
    },
  },
  {
    url: '/web/product/appConfig',
    method: 'post',
    response: () => {
      return successResponseWrap([]);
    },
  },
  {
    url: '/web/product/selectConfig',
    method: 'get',
    response: () => {
      return successResponseWrap([
        {
          username: '张三',
          memberId: '1',
        },
        {
          username: '李斯',
          memberId: '2',
        },
      ]);
    },
  },
];
