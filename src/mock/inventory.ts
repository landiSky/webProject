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
              id: '1788041657850138624',
              name: '标签三',
              tagCountByTag: null,
            },
            {
              id: '1788041632701091840',
              name: '标签二',
              tagCountByTag: null,
            },
            {
              id: '1788041390358401024',
              name: '标签一',
              tagCountByTag: null,
            },
          ],
        },
      ]);
    },
  },
];
