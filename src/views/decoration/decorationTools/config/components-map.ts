import { defineAsyncComponent } from 'vue';

const ComponentsMap: Record<string, any> = {
  SigleImgText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/single-image-text/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/single-image-text/ui-config.vue'
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
    uiConfig: () =>
      defineAsyncComponent(
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
    uiConfig: () =>
      defineAsyncComponent(
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
    uiConfig: () =>
      defineAsyncComponent(
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
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/multi-image-text/ui-config.vue'
          )
      ),
  },
  HerizontalImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/herizontal-image-text/view.vue'
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
  ImageOverlapText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/image-overlap-text/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/image-overlap-text/ui-config.vue'
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
    uiConfig: () =>
      defineAsyncComponent(
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
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/splice-image-text/ui-config.vue'
          )
      ),
  },
  CarouselImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/carousel-image-text/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/carousel-image-text/ui-config.vue'
          )
      ),
  },
  HomeHeader: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/home-header/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/home-header/ui-config.vue'
          )
      ),
  },
  ChannelHeader: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/channel-header/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/channel-header/ui-config.vue'
          )
      ),
  },
  MutiNavImageText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/multi-nav-image-text/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/multi-nav-image-text/ui-config.vue'
          )
      ),
  },
  SigleImg: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/single-image/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/single-image/ui-config.vue'
          )
      ),
  },
  DoubleImg: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/double-image/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/double-image/ui-config.vue'
          )
      ),
  },
  MutiNavText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/multi-nav-text/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/multi-nav-text/ui-config.vue'
          )
      ),
  },
  MutiIconText: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/multi-icon-text/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/multi-icon-text/ui-config.vue'
          )
      ),
  },
  ThreeImg: {
    view: defineAsyncComponent(
      () =>
        import(
          '@/views/decoration/decorationTools/components/three-img/view.vue'
        )
    ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/three-img/ui-config.vue'
          )
      ),
  },
};

export default ComponentsMap;
