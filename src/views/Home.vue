<template>
   <v-container >
     <v-row>
       <v-col cols="12">
        <div class="float-right">
          <dx-selectBox
            :items="genders"
            :value="genders[0]"
            @value-changed="onValueChanged"
          />
        </div>
        <div class="float-right mr-5">
          <dx-button
            icon="exportpdf"
            text="Export to PDF"
            @click="exportGrid()"
          />
        </div>
        
       </v-col>
     </v-row>
       
     <div class="mt-5">
      <dx-data-grid
            :ref="dataGridRef"
            key-expr="id"
            :height="500"
            :data-source="dataSource"
            :columns="columns"
            :allow-column-reordering="true"
            :allow-column-resizing="true"
            :show-borders="true"
            :columnAutoWidth="true"
            :hoverStateEnabled="true"
            :word-wrap-enabled="true"
            :filterRow="filterRow"
            :headerFilter="headerFilter"
            :searchPanel="searchPanel"
            :loadPanel="loadPanel"
            :noDataText="noDataText"
            :row-alternation-enabled="true"
            @cell-prepared="onCellPrepared"
            @selection-changed="onSelectionChanged"
           
        >
          <dx-load-panel :enabled="true"/>
          <dx-scrolling :mode="scrollingMode" />
         <!-- <dx-scrolling mode="infinite" />-->
          <dx-sorting mode="multiple"/>
          <dx-group-panel :visible="true"/>
          <dx-grouping 
            :auto-expand-all="false"
            :context-menu-enabled="true"
            expand-mode="rowClick"
          />
          <dx-selection
            select-all-mode="allPages"
            show-check-boxes-mode="onClick"
            mode="multiple"
          />
          <dx-summary :calculate-custom-summary="calculateSelectedRow">
            <dx-groupItem
              column="id"
              summary-type="count"
              display-format="Cantidad {0} "
            />
            <dx-groupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="salary"
              summary-type="max"
              value-format="currency"
            />
            <dx-groupItem
              :show-in-group-footer="true"
              column="salary"
              summary-type="sum"
              value-format="currency"
              display-format="Total: {0}"
            />
            <dx-totalItem
              name="SelectedRowsSummary"
              summary-type="custom"
              value-format="currency"
              display-format="Suma: {0}"
              show-in-column="salary"
            />
          </dx-summary>
         <dx-export
            :enabled="true"
          />
         
        </dx-data-grid>
     </div>

    </v-container>
</template>

<script>
import { generateData } from '../assets/generador';
import { DxDataGrid, DxScrolling, DxLoadPanel,DxSorting,DxSelection,DxGroupPanel,DxGrouping,
        DxSummary,DxGroupItem,DxTotalItem,DxExport } from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import DxSelectBox from 'devextreme-vue/select-box';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
const dataGridRef = 'dataGrid';
export default {
  name: 'Home',
  components: {
        DxDataGrid,
        DxScrolling,
        DxLoadPanel,
        DxSorting,
        DxSelectBox,
        DxSelection,
        DxGroupPanel,
        DxGrouping,
        DxSummary,
        DxGroupItem,
        DxTotalItem,
        DxButton,
        DxExport
    },
  data(){
      return{
        datos: '',
        GroupIndex: null,
        scrollingMode: "infinite",
        columns:[
                {
                    caption: "Id",
                    dataField: "id",
                    alignment:"center"
                },
                {
                    caption: "Name",
                    dataField: "firstName",
                    alignment:"center",
                    groupIndex: "GroupIndex"
                },
                {
                    caption: "Last Name",
                    dataField: "lastName",
                    alignment:"center"
                },
                {
                    caption: "Gender",
                    dataField: "gender",
                    alignment:"center",
                },
                {
                    caption: "BirthDate",
                    dataField: "birthDate",
                    alignment:"center",
                    dataType:"datetime",
                    format:"dd/MM/yyyy",
                },
                {
                    caption: "Salary",
                    dataField: "salary",
                    alignment:"center",
                    format:"currency"
                },
        ],
        noDataText: "No se encontrarón resultados",
            loadPanel: {
                text: "Cargando.."
            },
            filterRow:{
                visible: true,
                applyFilter: 'auto'
            },
            headerFilter:{
                visible: true
            },
            searchPanel:{
                visible: false,
                width: 120,
                placeholder: 'Buscar...'
            },
            genders: ['All', 'Male', 'Female'],
            dataGridRef
      }
  },
  async mounted(){

  },
  methods:{
    onValueChanged({ value }) {
      const dataGrid = this.$refs[this.dataGridRef].instance;

      if (value === 'All') {
        dataGrid.clearFilter();
      } else {
        dataGrid.filter(['gender', '=', value]);
      }
    },
    
    onCellPrepared(e) {
      var isGrouped =  !!e.component.columnOption("groupIndex:0")
      if(isGrouped){
        this.scrollingMode = 'virtual'
      }else{
        this.scrollingMode = 'infinite'
      }
    },
     calculateSelectedRow(options) {
      if (options.name === 'SelectedRowsSummary') {
        if (options.summaryProcess === 'start') {
          options.totalValue = 0;
        } else if (options.summaryProcess === 'calculate') {
          if (options.component.isRowSelected(options.value.id)) {
            options.totalValue += options.value.salary;
          }
        }
      }
    },
    onSelectionChanged(e) {
      e.component.refresh(true);
    },

     exportGrid() {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: this.dataGrid,
      }).then(() => {
        doc.save('DataGrid.pdf');
      });
    },
  },
  computed:{
     dataSource() {
      return generateData(5000);
    },
    dataGrid() {
      return this.$refs[dataGridRef].instance;
    },
  }

}
</script>
