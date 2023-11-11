import { successResponseWrap, failResponseWrap } from './response';

export default [
  {
    url: '/server/web/reception/selectReceptionPageList',
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
            logo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 2,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 0,
            logo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 3,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 1,
            logo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 4,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 0,
            logo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
          },
          {
            id: 5,
            name: '巴拉巴拉巴拉巴',
            companyName: '北京泰尔英福有限科技公司',
            introduction: '简介',
            price: '88.66',
            deliveryType: 1,
            logo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
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

  {
    url: '/server/web/reception/selectById',
    method: 'get',
    response: () => {
      return successResponseWrap({
        id: 1390951137157120,
        companyId: 1,
        companyName: '企业名称（商家名称）',
        name: '商品名称修改',
        logo: '商品logo',
        detailImg:
          'https://img13.360buyimg.com/n1/s450x450_jfs/t1/112503/16/27726/52988/64dc9a7cF0e258422/18c750bd3af78ff1.jpg.avif,//img13.360buyimg.com/n5/s54x54_jfs/t1/163744/5/40242/82186/64db82a5Ffa15c5cc/2befcc69725a22dd.jpg.avif,//img13.360buyimg.com/n5/s54x54_jfs/t1/112503/16/27726/52988/64dc9a7cF0e258422/18c750bd3af78ff1.jpg.avif,//img13.360buyimg.com/n5/s54x54_jfs/t1/102528/34/36773/44185/64db377cF64ce8f22/8e0604d47fafa774.jpg.avif,//img13.360buyimg.com/n5/s54x54_jfs/t1/128950/17/38984/28802/64db376fF8047295f/2ff219061faf6d35.jpg.avif,//img13.360buyimg.com/n5/s54x54_jfs/t1/84805/5/37021/24570/64db376fF79637b28/f5edd3e107e27915.jpg.avif',
        productTypeId: 1,
        type: 1,
        introduction:
          '谷歌公司（Google Inc.）成立于1998年9月4日，2022财年收入2828亿美元， [286]由拉里·佩奇和谢尔盖·布林共同创建，被公认为全球最大的搜索引擎公司。 [1]谷歌是一家位于美国的跨国科技企业，业务包括互联网搜索、云计算、广告技术等，同时开发并提供大量基于互联网的产品与服务，其主要利润来自于关键词广告等服务。',
        useExplain: 63,
        detail: '"\\"{\\\\\\"aa\\\\\\": \\\\\\"商品详情json格式\\\\\\"}\\""',
        status: 1,
        deliveryType: 1,
        url: 'test_d897ee7cb32d',
        saleType: 0,
        rejectReason: null,
        upShelfTime: null,
        tag: null,
        createUser: 'SYSTEM',
        createTime: '2023-10-22 09:33:20',
        updateUser: 'SYSTEM',
        updateTime: '2023-10-22 19:03:09',
        isDeleted: 0,
        productDeliverySetList: [
          {
            id: 1390951226138622,
            productId: 1390951137157120,
            name: '交付版本1',
            appSecret: 'test_f5c35488ad4e',
            accountNum: 40,
            price: 70.46,
            duration: 93,
            sequence: 72,
            createUser: 'SYSTEM',
            createTime: '2023-10-22 09:35:08',
            updateUser: 'SYSTEM',
            updateTime: '2023-10-22 22:56:32',
            isDeleted: 0,
            accountNumList: [
              {
                id: 11,
                productDeliverySetId: 1390951226138622,
                accountNum: 10,
              },
              {
                id: 22,
                productDeliverySetId: 1390951226138622,
                accountNum: 50,
              },
              {
                id: 33,
                productDeliverySetId: 1390951226138622,
                accountNum: 100,
              },
            ],
            durationList: [
              {
                id: 11,
                productDeliverySetId: 1390951226138622,
                duration: 1,
              },
              {
                id: 12,
                productDeliverySetId: 1390951226138622,
                duration: 6,
              },
              {
                id: 13,
                productDeliverySetId: 1390951226138622,
                duration: 12,
              },
            ],
          },
          {
            id: 1390951226138624,
            productId: 1390951137157120,
            name: '交付版本2',
            appSecret: 'test_f5c35488ad4e',
            accountNum: 57,
            price: 80.46,
            duration: 93,
            sequence: 72,
            createUser: 'SYSTEM',
            createTime: '2023-10-22 09:35:08',
            updateUser: 'SYSTEM',
            updateTime: '2023-10-22 19:02:26',
            isDeleted: 0,
            accountNumList: [
              {
                id: 22,
                productDeliverySetId: 1390951226138624,
                accountNum: 50,
              },
              {
                id: 33,
                productDeliverySetId: 1390951226138624,
                accountNum: 100,
              },
            ],
            durationList: [
              {
                id: 11,
                productDeliverySetId: 1390951226138624,
                duration: 6,
              },
              {
                id: 13,
                productDeliverySetId: 1390951226138624,
                duration: 12,
              },
            ],
          },
        ],
      });
    },
  },

  {
    url: '/server/web/reception/computePrice',
    method: 'get',
    response: () => {
      return successResponseWrap(8000);
    },
  },
];
