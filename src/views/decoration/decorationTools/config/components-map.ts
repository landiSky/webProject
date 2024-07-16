import { defineAsyncComponent } from 'vue';

const ComponentsMap: Record<string, any> = {
  SigleImg: {
    view: () =>
      defineAsyncComponent(
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
  VerticalImageText: {
    view: () =>
      defineAsyncComponent(
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
    view: () =>
      defineAsyncComponent(
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
    view: () =>
      defineAsyncComponent(
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
};

export default ComponentsMap;
