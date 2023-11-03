<template>
  <div>
    <div>商品管理</div>

    <TemplateDrawer
      ref="tempRef"
      :template-data="templateData"
    ></TemplateDrawer>

    <t-button @click="getData">获取 json</t-button>
    <div>{{ templateData }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import TemplateDrawer from './template.vue';

const testData =
  '[{"type":1,"moduleName":"模板一","blockList":[{"name":"区块一","desc":"区块一简介：建议图片尺寸：200px * 200px，支持jpg、png、bmp","picUrl":"blob:http://localhost:3000/81f8cdba-1837-45bc-93a0-c047f897ebb3"},{"name":"区块二","desc":"区块二简介：建议图片尺寸：200px * 200px，支持jpg、png、bmp","picUrl":"blob:http://localhost:3000/0284b490-be98-4ee7-a613-a24a5f716ff7"},{"name":"区块三","desc":"区块三简介：建议图片尺寸：200px * 200px，支持jpg、png、bmp","picUrl":"blob:http://localhost:3000/ecb029f9-79a5-4433-98a2-4900273025a0"}]},{"type":2,"moduleName":"模板二","blockList":[{"name":"区块一","desc":"区块一简介：建议图片尺寸：200px * 200px，支持jpg、png、","picUrl":"blob:http://localhost:3000/57f13df5-55e9-434a-b65a-74990b417ab6"}]},{"type":3,"moduleName":"模板三","picUrl":"blob:http://localhost:3000/0270dd70-e5b5-4c50-a96e-1223c2a41cad","blockList":[{"name":"区块一","desc":"图片紫葡萄"},{"name":"区块二","desc1":"简介 1：把尔粉色发非法人非法是的色粉舒服分手的方式实习","desc2":"简介 2：把尔粉色发非法人非法是的色粉舒服分手的方式实习","desc3":"简介 3：把尔粉色发非法人非法是的色粉舒服分手的方式实习"}]}]';

const tempRef = ref();
const templateData = ref(JSON.parse(testData));
const getData = () => {
  templateData.value = JSON.stringify(tempRef.value.templateData);
  console.log('index.xz.vue:19', templateData.value);
};
</script>

<style lang="less" scoped></style>
