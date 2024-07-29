import { defineStore } from 'pinia';

export const useDecorationStore = defineStore({
  id: 'app-decorarion',
  state: (): {
    platFormName: string; // 平台名称
    platFormLogo: string; // 平台logo
    chnnelPageRefresh: boolean; // 频道页刷新
    curComponentData: any; // 当前选中组件数据
    curConfigData: any; // 当前选中组件配置数据
    isPreview: boolean; // 是否预览
    isSourceRefresh: boolean; // 是否源页面刷新
    curSelectIndex: number; // 选择的组件索引
  } => ({
    platFormName: '',
    platFormLogo: '',
    chnnelPageRefresh: false,
    curComponentData: {},
    curConfigData: {},
    isPreview: false,
    isSourceRefresh: false,
    curSelectIndex: 0,
  }),

  actions: {
    // 设置平台名称
    setPlatFormName(name: string) {
      this.platFormName = name;
    },
    // 设置平台logo
    setPlatFormLogo(logo: string) {
      this.platFormLogo = logo;
    },
    // 设置频道页刷新状态
    setChannelPageRefresh(state: boolean) {
      this.chnnelPageRefresh = state;
    },
    // 设置当前装修组件数据
    setcurComponentData(data: any) {
      this.curComponentData = data;
    },
    // 设置当前配置数据
    setcurConfigData(data: any) {
      this.curConfigData = data;
    },
    // 设置预览状态
    setPreview(state: boolean) {
      this.isPreview = state;
    },
    // 设置源页面刷新状态
    setSourceRefresh(state: boolean) {
      this.isSourceRefresh = state;
    },
    // 设置选择的组件索引
    setSelectIndex(index: number) {
      this.curSelectIndex = index;
    },
  },
});
