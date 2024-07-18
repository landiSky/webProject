import { defineAsyncComponent } from 'vue';
import View from '../components/herizontal-image-text/view.vue';

const ComponentsMap: Record<string, any> = {
  SigleImg: {
    view: () =>
      defineAsyncComponent(
        {
          // 使用loader函数来创建异步组件
          loader: () =>
            import(
              '@/views/decoration/decorationTools/components/single-image/view.vue'
            ),
          // 提供一个在组件加载时显示的组件
          loadingComponent: View, // LoadingComponent是一个已定义的组件
          // 提供一个在组件加载失败时显示的组件
          errorComponent: View, // ErrorComponent是一个已定义的组件
          // 设置delay为null取消自动显示的加载组件的延迟
          delay: null,
          // 如果提供了timeout，则这个时间过后，如果组件还没加载出来，会使用errorComponent
          timeout: 3000,
        }
        // () =>
        //   import(
        //     '@/views/decoration/decorationTools/components/single-image/view.vue'
        //   )
      ),
    uiConfig: () =>
      defineAsyncComponent(
        () =>
          import(
            '@/views/decoration/decorationTools/components/single-image/ui-config.vue'
          )
      ),
  },
  VerticalImageText: {
    view: () =>
      defineAsyncComponent(
        {
          // 使用loader函数来创建异步组件
          loader: () =>
            import(
              '@/views/decoration/decorationTools/components/vertival-image-text/view.vue'
            ),
          // 提供一个在组件加载时显示的组件
          loadingComponent: View, // LoadingComponent是一个已定义的组件
          // 提供一个在组件加载失败时显示的组件
          errorComponent: View, // ErrorComponent是一个已定义的组件
          // 设置delay为null取消自动显示的加载组件的延迟
          delay: null,
          // 如果提供了timeout，则这个时间过后，如果组件还没加载出来，会使用errorComponent
          timeout: 3000,
        }
        // () =>
        //   import(
        //     '@/views/decoration/decorationTools/components/vertival-image-text/view.vue'
        //   )
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
