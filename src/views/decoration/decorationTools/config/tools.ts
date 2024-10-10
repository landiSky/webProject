import singleImgText from '@/assets/images/decoration/sigleImgText.png';
import verticalImageText from '@/assets/images/decoration/verticalImageText.png';
import threeImageText from '@/assets/images/decoration/threeImageText.png';
import multiImageText from '@/assets/images/decoration/multiImageText.png';
import iconImageText from '@/assets/images/decoration/iconImageText.png';
import imageOverlapText from '@/assets/images/decoration/imageOverlapText.png';
import leftRightImageText from '@/assets/images/decoration/leftRightImageText.png';
import spliceImageText from '@/assets/images/decoration/spliceImageText.png';
import herizontalImageText from '@/assets/images/decoration/herizontalImageText.png';
import carouselImageText from '@/assets/images/decoration/carouselImageText.png';
import mutiNavImageText from '@/assets/images/decoration/mutiNavImageText.png';
import sigleImg from '@/assets/images/decoration/sigleImg.png';
import mutiNavText from '@/assets/images/decoration/mutiNavText.png';
import mutiIconText from '@/assets/images/decoration/mutiIconText.png';
import threeImg from '@/assets/images/decoration/threeImg.png';
import multiNavImg from '@/assets/images/decoration/multiNavImg.png';
import treeTextNavigation from '@/assets/images/decoration/treeTextNavigation.png';
import doubleImg from '@/assets/images/decoration/doubleImg.png';
import { getNowFormatDate } from '@/utils';
import { LinkType } from '../constant';

// 如需修改配置，请把ToolData和tools同步修改！！！
export const ToolData: Record<string, any> = {
  SigleImgText: {
    chineseName: '单图文',
    maxNum: 3,
    icon: 'singleImgTxt',
    name: 'SigleImgText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: {
      src: '70e7236d-5e78-44c0-be4c-198705a87329.png',
      desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
      linkType: LinkType.BLANK,
      linkUrl: '',
    },
  },
  VerticalImageText: {
    chineseName: '竖图文',
    maxNum: 5,
    icon: 'verticalImgTxt',
    name: 'VerticalImageText',
    mainTitle: '主标题',
    bgColor: '#F5F6FB',
    configValue: [
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  ThreeImageText: {
    chineseName: '三图叠文',
    maxNum: 5,
    icon: 'threeImgTxt',
    name: 'ThreeImageText',
    mainTitle: '主标题',
    bgColor: '#F5F6FB',
    configValue: [
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介，我是简介，我是简介我是简介我是简介，我是简介我是简介我是简介我是简介。',
        src: '65ef81c2-e4f1-4dd6-b98e-109c91da6e64.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介，我是简介，我是简介我是简介我是简介，我是简介我是简介我是简介我是简介。',
        src: '65ef81c2-e4f1-4dd6-b98e-109c91da6e64.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介，我是简介，我是简介我是简介我是简介，我是简介我是简介我是简介我是简介。',
        src: '65ef81c2-e4f1-4dd6-b98e-109c91da6e64.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  MultiImageText: {
    chineseName: '多图文',
    maxNum: 4,
    icon: 'multiImgTxt',
    name: 'MultiImageText',
    mainTitle: '主标题',
    bgColor: '#F5F6FB',
    configValue: [
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题',
        src: '8fae7110-79aa-44b2-acd1-8c4d8078e682.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题',
        src: '118467fd-eadb-40f7-b676-2e346dfb94b7.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题',
        src: 'bdda313a-3d31-4512-bf8c-fbb214e1017c.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题',
        src: 'b383f40c-f6d2-47d3-ab23-5ffe3eace7db.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  IconImageText: {
    chineseName: '图标叠文',
    maxNum: 5,
    icon: 'iconTxt',
    name: 'IconImageText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: 'da6f982f-bd76-4415-9b15-9a322b7fd4c6.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: '2f795f29-4f92-42f0-86d8-366d118190cc.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: '1687fc23-446c-4c1a-b13a-90984899bace.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: 'b2c1ead5-bb4c-46b4-a921-d7a3b6ad5c0e.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  ImageOverlapText: {
    chineseName: '图叠文',
    maxNum: 3,
    icon: 'imgTxt',
    name: 'ImageOverlapText',
    mainTitle: '主标题',
    bgColor: '#ffffff#e2ecff',
    configValue: [
      {
        title: '小标题',
        src: '88978187-7e7f-4346-9dd8-48eaca7e80ea.png',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        src: '92c64d18-4606-4279-bc90-fa049e78ab1e.png',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        src: 'a2a9610e-c596-4c87-9810-ee687b2793e1.png',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  LeftRightImageText: {
    chineseName: '左右图文',
    maxNum: 5,
    icon: 'leftRightImgTxt',
    name: 'LeftRightImageText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        title: '小标题',
        desc: '我是副标题，我是副标题我是副标题，我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题。我是副标题，我是副标题我是副标题，我是副标题我是副标题我是副标题我是副标题我是副标题',
        src: 'adf3d564-271d-4e38-84c1-933be3e470ea.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题，我是副标题我是副标题，我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题。我是副标题，我是副标题我是副标题，我是副标题我是副标题我是副标题我是副标题我是副标题',
        src: 'adf3d564-271d-4e38-84c1-933be3e470ea.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题，我是副标题我是副标题，我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题我是副标题。我是副标题，我是副标题我是副标题，我是副标题我是副标题我是副标题我是副标题我是副标题',
        src: 'adf3d564-271d-4e38-84c1-933be3e470ea.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  SpliceImageText: {
    chineseName: '拼图文',
    maxNum: 5,
    icon: 'stitchingImgTxt',
    name: 'SpliceImageText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue1: {
      subTitle: '我是主标题我是主标题',
      config: [
        {
          title: '小标题',
          desc: '我是简介我是简介我是简介我是简介我是简介',
          src: '8b4cd580-5180-48c7-bef5-2b163fad1397.png',
          linkType: LinkType.BLANK,
          linkUrl: '',
        },
        {
          title: '小标题',
          desc: '我是简介我是简介我是简介我是简介我是简介',
          src: '8b4cd580-5180-48c7-bef5-2b163fad1397.png',
          linkType: LinkType.BLANK,
          linkUrl: '',
        },
      ],
    },
    configValue2: {
      subTitle: '我是主标题我是主标题',
      config: [
        {
          title: '小标题',
          desc: '我是简介我是简介我是简介我是简介我是简介',
          src: '8b4cd580-5180-48c7-bef5-2b163fad1397.png',
          linkType: LinkType.BLANK,
          linkUrl: '',
        },
        {
          title: '小标题',
          desc: '我是简介我是简介我是简介我是简介我是简介',
          src: '8b4cd580-5180-48c7-bef5-2b163fad1397.png',
          linkType: LinkType.BLANK,
          linkUrl: '',
        },
      ],
    },
  },
  HerizontalImageText: {
    chineseName: '横图叠文',
    maxNum: 3,
    icon: 'imgTxt',
    name: 'HerizontalImageText',
    mainTitle: '主标题',
    bgColor: '#ffffff#e2ecff',
    configValue: [
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: 'c3068687-c105-4d14-80eb-a5493a1522d2.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: 'ec96e4f6-a83b-4945-aa6d-9e0d0ba66f2c.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是副标题我是副标题我是副标题我是副标题',
        src: 'ec96e4f6-a83b-4945-aa6d-9e0d0ba66f2c.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  CarouselImageText: {
    chineseName: '轮播图',
    maxNum: 5,
    icon: 'slideshow',
    name: 'CarouselImageText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
        src: '5b9d9a1d-d523-46cb-afb8-57badb9ef3d9.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
        src: '5b9d9a1d-d523-46cb-afb8-57badb9ef3d9.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
        src: '5b9d9a1d-d523-46cb-afb8-57badb9ef3d9.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  MutiNavImageText: {
    chineseName: '多导航图文',
    maxNum: 8,
    icon: 'mutiNavImgTxt',
    name: 'MutiNavImageText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        navTitle: '子导航',
        desc: '简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字',
        src: 'f9075041-c2f9-4e7d-b75c-3afeee079129.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        navTitle: '子导航',
        desc: '简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字',
        src: 'f9075041-c2f9-4e7d-b75c-3afeee079129.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  SigleImg: {
    chineseName: '单图',
    maxNum: 1,
    icon: 'singleImg',
    name: 'SigleImg',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: {
      src: 'f9075041-c2f9-4e7d-b75c-3afeee079129.png',
      desc: '',
      linkType: LinkType.BLANK,
      linkUrl: '',
    },
  },
  DoubleImg: {
    chineseName: '双图',
    maxNum: 5,
    icon: 'doubleImg',
    name: 'DoubleImg',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        title: '副标题',
        desc: '',
        src: '5b9d9a1d-d523-46cb-afb8-57badb9ef3d9.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '副标题',
        desc: '',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  MutiNavText: {
    chineseName: '多导航文字',
    maxNum: 8,
    icon: 'mutiNavTxt',
    name: 'MutiNavText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        navTitle: '子导航',
        title: '名称名称名称名称名称名称名称名称名称名称',
        desc: '简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字',
        src: '',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        navTitle: '子导航',
        title: '名称名称名称名称名称名称名称名称名称名称',
        desc: '简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字简介二百字',
        src: '',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  MutiIconText: {
    chineseName: '图标文字',
    maxNum: 9,
    icon: 'mutiIconTxt',
    name: 'MutiIconText',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        title: '子标题',
        desc: '副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字',
        src: '12e87e00-67c9-448f-bad4-b6938da4d830.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '子标题',
        desc: '副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字',
        src: 'cfcd43ad-5be2-4ffa-a173-b2fc5061925c.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '子标题',
        desc: '副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字副标题一百字',
        src: 'e1f1abaf-2296-494c-9d7a-208b27668078.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  ThreeImg: {
    chineseName: '三图',
    maxNum: 5,
    icon: 'threeImg',
    name: 'ThreeImg',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        title: '小标题',
        src: '5b9d9a1d-d523-46cb-afb8-57badb9ef3d9.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        src: '9afb0bf5-152b-440a-b4f5-0b1a24fd4e08.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        title: '小标题',
        src: '8b4cd580-5180-48c7-bef5-2b163fad1397.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  MultiNavImg: {
    chineseName: '多导航图',
    maxNum: 8,
    icon: 'mutiNavImg',
    name: 'MultiNavImg',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        navTitle: '子导航',
        src: 'f9075041-c2f9-4e7d-b75c-3afeee079129.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        navTitle: '子导航',
        src: 'f9075041-c2f9-4e7d-b75c-3afeee079129.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
      {
        navTitle: '子导航',
        src: 'f9075041-c2f9-4e7d-b75c-3afeee079129.png',
        linkType: LinkType.BLANK,
        linkUrl: '',
      },
    ],
  },
  TreeTextNavigation: {
    chineseName: '树文本导航',
    maxNum: 10,
    maxContentNum: 20,
    icon: 'verticalNavTxt',
    name: 'TreeTextNavigation',
    mainTitle: '主标题',
    bgColor: '#ffffff',
    configValue: [
      {
        navTitle: '子标题',
        contentList: [
          {
            time: getNowFormatDate(),
            name: '我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称',
            desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
            linkType: LinkType.BLANK,
            linkUrl: '',
          },
        ],
      },
      {
        navTitle: '子标题',
        contentList: [
          {
            time: getNowFormatDate(),
            name: '我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称',
            desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
            linkType: LinkType.BLANK,
            linkUrl: '',
          },
        ],
      },
    ],
  },
};

export const tools = [
  'SigleImgText',
  'ImageOverlapText',
  'VerticalImageText',
  'LeftRightImageText',
  'ThreeImageText',
  'SpliceImageText',
  'MultiImageText',
  'HerizontalImageText',
  'IconImageText',
  'CarouselImageText',
  'MutiNavImageText',
  'MutiIconText',
  'SigleImg',
  'DoubleImg', // 这里替换旭蓓的双图
  'ThreeImg',
  'MultiNavImg',
  'TreeTextNavigation',
  'MutiNavText',
];

export const toolsGroup = [
  {
    // id: 1,
    type: 'title',
    title: '图文组件',
    noDrag: true,
  },
  {
    id: 2,
    text: 'SigleImgText',
    noDrag: false,
    tooltipImage: singleImgText,
  },
  {
    id: 3,
    text: 'ImageOverlapText',
    noDrag: false,
    tooltipImage: imageOverlapText,
  },
  {
    id: 4,
    text: 'VerticalImageText',
    noDrag: false,
    tooltipImage: verticalImageText,
  },
  {
    id: 5,
    text: 'LeftRightImageText',
    noDrag: false,
    tooltipImage: leftRightImageText,
  },
  {
    text: 'ThreeImageText',
    noDrag: false,
    tooltipImage: threeImageText,
  },
  {
    text: 'SpliceImageText',
    noDrag: false,
    tooltipImage: spliceImageText,
  },
  {
    text: 'MultiImageText',
    noDrag: false,
    tooltipImage: multiImageText,
  },
  {
    text: 'HerizontalImageText',
    noDrag: false,
    tooltipImage: herizontalImageText,
  },
  {
    text: 'IconImageText',
    noDrag: false,
    tooltipImage: iconImageText,
  },
  {
    text: 'CarouselImageText',
    noDrag: false,
    tooltipImage: carouselImageText,
  },
  {
    text: 'MutiNavImageText',
    noDrag: false,
    tooltipImage: mutiNavImageText,
  },
  {
    text: 'MutiIconText',
    noDrag: false,
    tooltipImage: mutiIconText,
  },
  {
    type: 'title',
    title: '纯图组件',
    noDrag: true,
  },
  {
    text: 'SigleImg',
    noDrag: false,
    tooltipImage: sigleImg,
  },
  {
    text: 'DoubleImg',
    noDrag: false,
    tooltipImage: doubleImg,
  },
  {
    text: 'ThreeImg',
    noDrag: false,
    tooltipImage: threeImg,
  },
  {
    text: 'MultiNavImg',
    noDrag: false,
    tooltipImage: multiNavImg,
  },
  {
    type: 'title',
    title: '纯文组件',
    noDrag: true,
  },
  {
    text: 'TreeTextNavigation',
    noDrag: false,
    tooltipImage: treeTextNavigation,
  },
  {
    text: 'MutiNavText',
    noDrag: false,
    tooltipImage: mutiNavText,
  },
];
