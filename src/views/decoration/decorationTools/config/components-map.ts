import { defineAsyncComponent } from 'vue';

const ComponentsMap: Record<string, any> = {
  SigleImg: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/single-image/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/single-image/ui-config.vue'
        )
    ),
  },
  VerticalImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/vertival-image-text/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/vertival-image-text/ui-config.vue'
        )
    ),
  },
  ThreeImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/three-image-text/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/three-image-text/ui-config.vue'
        )
    ),
  },
  LeftRightImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/left-right-image-text/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/left-right-image-text/ui-config.vue'
        )
    ),
  },
  MultiImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/multi-image-text/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/multi-image-text/ui-config.vue'
        )
    ),
  },
  HerizontalImageText: {
    view: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/icon-image-text/view.vue'
          )
      ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/herizontal-image-text/ui-config.vue'
          )
      ),
  },
  IconImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/icon-image-text/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/icon-image-text/ui-config.vue'
        )
    ),
  },
  SpliceImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/splice-image-text/view.vue'
        )
    ),
    uiConfig: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/splice-image-text/ui-config.vue'
        )
    ),
  },
};

export default ComponentsMap;
