const tools = [
  {
    groupName: '图文类',
    componentList: [
      {
        title: '单图',
        maxNum: 3,
        icon: 'el-icon-picture',
        name: 'SigleImg',
        value: {
          title: '',
          src: 'https://inews.gtimg.com/om_bt/OHyQqgC_5oi4Vm0tlH49XvJzqNBHo2Zryxx5F_be5N2cIAA/1000',
          desc: 'balabala',
          linkType: 0,
          linkUrl: 'http://www.baidu.com',
        },
      },
      {
        title: '多图(5)',
        maxNum: 5,
        icon: 'el-icon-picture',
        name: 'SigleImg',
        value: {
          title: '',
        },
      },
      //   {
      //     title: '多图(2-3)',
      //     maxNum: 10,
      //     icon: 'el-icon-s-grid',
      //     name: 'MultipleImg2_3',
      //     componentPack: componentPackMultipleImg23,
      //   },
      //   {
      //     title: '多图(1-3)',
      //     maxNum: 10,
      //     icon: 'el-icon-s-grid',
      //     name: 'MultipleImg1_3',
      //     componentPack: componentPackMultipleImg13,
      //   },
    ],
  },
  //   {
  //     groupName: '商品类',
  //     componentList: [
  //       {
  //         title: '全部商品',
  //         maxNum: 1,
  //         icon: 'el-icon-s-goods',
  //         componentPack: componentPackAllGoodsList,
  //         name: 'AllGoodsList',
  //         additional: {
  //           bottomDisplay: true,
  //           unRemove: true, // 不可移除
  //         },
  //       },
  //       {
  //         title: '推荐商品',
  //         maxNum: 1,
  //         icon: 'el-icon-s-goods',
  //         name: 'RecommendedGoodsList',
  //         componentPack: componentPackRecommendedGoodsList,
  //       },
  //     ],
  //   },
  //   {
  //     groupName: '营销互动类',
  //     componentList: [
  //       {
  //         title: '优惠券',
  //         maxNum: 1,
  //         icon: 'el-icon-s-ticket',
  //         name: 'Coupon',
  //         componentPack: componentPackCoupon,
  //       },
  //     ],
  //   },
];

export default tools;
