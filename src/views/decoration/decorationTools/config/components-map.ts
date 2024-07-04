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
};

export default ComponentsMap;
