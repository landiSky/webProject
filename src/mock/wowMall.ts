import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    url: '/web/reception/selectReceptionPageList',
    method: 'get',
    response: () => {
      return successResponseWrap({
        total: 5,
        records: [
          {
            id: 1,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 1,
            logo:
              'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 2,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 0,
            logo:
              'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 3,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 1,
            logo:
              'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 4,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 0,
            logo:
              'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 5,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 1,
            logo:
              'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
        ],
      });
    },
  },

  {
    url: '/api/v1/login/name',
    method: 'post',
    response: () => {
      return successResponseWrap({
        imgList: [
          'https://img13.360buyimg.com/n1/s450x450_jfs/t1/112503/16/27726/52988/64dc9a7cF0e258422/18c750bd3af78ff1.jpg.avif',
          'https://img13.360buyimg.com/n5/s54x54_jfs/t1/11516…81804/6536985aFad2f6759/146058ce4b8221d6.jpg.avif',
          'https://img12.360buyimg.com/n5/s54x54_jfs/t1/10907…44074/6422a6a5Fcfe2f12c/41341077379b4673.jpg.avif',
          'https://img12.360buyimg.com/n5/s54x54_jfs/t1/94016…41284/648f257cF791ec5dd/0bb3e0a84a3247a8.jpg.avif',
          'https://img12.360buyimg.com/n5/s54x54_jfs/t1/68595…55266/6422a6a5F92f7db32/2328337ee4a3720a.jpg.avif',
        ],
      });
    },
  },
];
