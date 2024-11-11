<template>
  <div class="hot-table"> 
    <hot-table 
    ref="hotTableRef"
    :data="data"
    :settings="hotSettings"
    :rowHeaders="true"
    :colHeaders="true" 
    licenseKey="non-commercial-and-evaluation"
    class="overflow-auto"
  />
   </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { HyperFormula } from 'hyperformula';
import { HotTable } from '@handsontable/vue3';

export default defineComponent({
  components: {
    HotTable,
  },
  setup() {
  const hotTableRef = ref(null);
  const data = ref([]);
  const hotSettings = ref({
      colHeaders: true,
      rowHeaders: true,
      mergeCells: true,
      manualColumnMove: true,
      manualColumnResize: true,
      manualRowResize: true,
      manualRowMove: true,
      contextMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      formulas: {
        engine: HyperFormula,
      },
      width: '100%',
      height: '100%',
      // cells() {
      //   const cellProperties = {}; 
      //   cellProperties.renderer = customCellRenderer;
      //   return cellProperties;
      // },
      // afterChange: onCellChange,
      // afterSelection: onCellSelect,
    });

    return {
      hotTableRef,
      data,
      hotSettings,
    }
  }
});
</script>