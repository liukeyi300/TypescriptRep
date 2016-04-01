module AicTech.Web.Html {
    export class OEEChartBase<T extends IRecord> extends Module.ModuleBase {
        private options: ChartOptionsContent[];

        protected chartType: { chartTypeName: string, chartTypeValue: ChartType}[];
        protected circlePickerSeries: { circleName: string, circleValue: CircleViews}[];

        protected allOrignalData: T[];
        protected allParData;

        constructor(options: ChartOptionsContent[]) {
            super();
            this.options = options;
            this.allOrignalData = [];
            this.chartType = [];
            this.circlePickerSeries = [];
            $.extend(this.viewModel, kendo.observable({
                series: [],
                isOverlayShow: true,
                selectedDataFilter: [],
                dataFilterSeries: [],
                dataFilterChanged: function (e) {
                    var instance = <OEEChartBase<T>>Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName),
                        showRecList = [],
                        currentParValue = $('#' + $(e.target).val()).val();
                    if (typeof currentParValue === 'undefined' || currentParValue === '') {
                        return;
                    }
                    showRecList = instance.filterData();
                    instance.pretreatData(showRecList);
                    instance.redrawChart();
                },
                filterData: function (e) {
                    var selectedFilter: any[] = this.get('selectedDataFilter'),
                        instance = <OEEChartBase<T>>Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName),
                        showRecList = [];
                    if (selectedFilter.length > 0) {
                        showRecList = instance.filterData();
                        instance.pretreatData(showRecList);
                        instance.redrawChart();
                    }
                },
                selectedCalcMethod: 0,
                calcMethodSelectChanged: function (e) {
                    (<OEEChartBase<T>>Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName)).redrawChart();
                },
                selectedCircle: CircleViews.Original,
                countCircleChanged: function (e) {
                    (<OEEChartBase<T>>Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName)).redrawChart();
                },
                selectedChartType: ChartType.Line,
                chartTypeChanged: function (e) {
                    (<OEEChartBase<T>>Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName)).switchChartType();
                },
            }));
        }

        protected filterData(): T[]{
            var selectedPar: IParameter[] = [],
                selectedParId: string[] = this.viewModel.get('selectedDataFilter') || [],
                i,
                parNum = selectedParId.length,
                result: T[] = [];

            for (i = 0; i < parNum; i++) {
                selectedPar.push({
                    parId: selectedParId[i],
                    parValue: $('#' + selectedParId[0]).val()
                });
            }
            result = Utils.ArrayUtils.filterByParameter<T>(this.allOrignalData, selectedPar, this.allParData);
            return result;
        }

        protected pretreatData(data: T[]) { }

        protected redrawChart() {
            this._redraw();
        }

        protected switchChartType() { }

        /**
         * 重绘函数
         */
        protected _redraw(startPoint?: number, maxNum?: number, keyArray?: any[], dataArray?: any[]) { }

        protected noData() {
            this.viewModel.set('isOverlayShow', true);
            this.viewModel.set('series', []);
            this.viewModel.set('timeTipsStart', 'start');
            this.viewModel.set('timeTipsEnd', 'end');
        }

        protected hadData() {
            this.viewModel.set('isOverlayShow', false);
        }

        private addOptions() {
            var container = this.view.find('.aic-chart-options');
            container.empty();

            if (this.options.indexOf(ChartOptionsContent.legend) > -1) {
                var legendTemplate = kendo.template($('#legend-color-list').html()),
                    legendRe,
                    causeStyleArray = [];

                StartUp.Instance.allCauseStyle.forEach((it) => {
                    if (it.causeColor !== null) {
                        causeStyleArray.push({
                            className: 'vis-item-' + it.causeId,
                            showName: it.causeId
                        });
                    } else {
                        causeStyleArray.push({
                            className: 'vis-item-default',
                            showName: it.causeId
                        });
                    }
                });

                if (causeStyleArray.length > 0) {
                    legendRe = legendTemplate(causeStyleArray);
                }

                container.append($(legendRe));
            }

            if (this.options.indexOf(ChartOptionsContent.chartType) > -1) {
                var chartTypeTemplate = kendo.template($('#chart-type-list').html()),
                    chartRe = chartTypeTemplate(this.chartType);
                container.append($(chartRe));
            }

            if (this.options.indexOf(ChartOptionsContent.dataSegSingle) > -1) {
                var dataSegSingleTemplate = kendo.template($('#data-seg-single-list').html()),
                    dataSegSingleRe = dataSegSingleTemplate([]);
                container.append($(dataSegSingleRe));
            }

            if (this.options.indexOf(ChartOptionsContent.dataSeg) > -1) {
                var dataSegTemplate = kendo.template($('#data-seg-list').html()),
                    dataSegRe = dataSegSingleTemplate([]);
                container.append($(dataSegRe));
            }

            if (this.options.indexOf(ChartOptionsContent.calcCircle) > -1) {
                var countCircleTemplate = kendo.template($('#count-circle-list').html()),
                    calCircleRe = countCircleTemplate(this.circlePickerSeries);
                container.append($(calCircleRe));
            }

            if (this.options.indexOf(ChartOptionsContent.dataGroup) > -1) {

            }

            if (this.options.indexOf(ChartOptionsContent.calcMethod) > -1) {
                var calcMethodTemplate = kendo.template($('#calc-method-list').html()),
                    calcRe = calcMethodTemplate([]);
                container.append($(calcRe));
            }

            if (this.options.indexOf(ChartOptionsContent.dataFilter) > -1) {
                var dataFilterTemplate = kendo.template($('#data-filter-list').html()),
                    dataFilterRe = dataFilterTemplate([]);
                container.append($(dataFilterRe));
            }
        }

        public init(view: JQuery) {
            super.init(view);
            this.addOptions();
        }
    }
}