import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    url: '/inventory/web/tag/tree',
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
];
