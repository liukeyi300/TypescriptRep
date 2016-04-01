/// <reference path="../../../../reference.ts" />
module AicTech.Web.Html {
    export class DowntimeTimelineChart extends Module.ModuleBase {
        private allDtData: DowntimeWithEqp[];
        private allParData;
        private allParValueList;

        private allRec: string[] = [];
      
        private dataItems = new vis.DataSet();
        private dataGroups = new vis.DataSet();
        private timeline: vis.Timeline;

        constructor() {
            super();
            this.viewModel = kendo.observable({
                selectedDataFilter: [],
                dataFilterSeries: [],
                dataFilterChanged: function (e) {
                    var instance = <DowntimeTimelineChart>Module.ModuleLoad.getModuleInstance('DowntimeTimelineChart'),
                        showRecList = [];
                    showRecList = instance.filterData();
                    instance._redraw(showRecList);
                },
                filterData: function (e) {
                    var selectedFilter: any[] = this.get('selectedDataFilter'),
                        instance = <DowntimeTimelineChart>Module.ModuleLoad.getModuleInstance("DowntimeTimelineChart"),
                        showRecList = [];
                    if (selectedFilter.length > 0) {
                        showRecList = instance.filterData();
                        instance._redraw(showRecList);
                    }
                }
            });
        }

        private initWidgets(): void {
            var legendTemplate = kendo.template($('#legend-color-list').html()),
                dataFilterTemplate = kendo.template($('#data-filter-list').html()),
                legendRe,
                dataFilterRe = dataFilterTemplate([]),
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

            $('.aic-chart-options').empty();

            var container = $('#downtime-timeline-chart')[0];
            var options = {
                orientation: 'top',
                selectable: false
            };
            this.timeline = new vis.Timeline(container, this.dataItems, this.dataGroups, options);

            $(legendRe).appendTo($('.aic-chart-options'));
            $(dataFilterRe).appendTo($('.aic-chart-options'));
        }

        refreshData(): void {
            super.refreshData();
                var allEqu = [],
                    dtInstance: DowntimeTimelineChart = <DowntimeTimelineChart>Module.ModuleLoad.getModuleInstance("DowntimeTimelineChart"),
                    start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                    end = this.endTime || new Date(),
                    allEquId = [];

                if (this.equipId !== null && this.equipId !== "") {
                    allEqu.push({ id: this.equipId, content: this.equipName });
                    this.dataGroups.update({ id: this.equipId, content: this.equipName });
                } else {
                    allEqu = this.dataGroups.get();
                    this.dataItems.clear();
                }

                allEqu.forEach((it) => {
                    allEquId.push(it.id);
                });
                if (allEquId.length > 0) {
                    this.allDtData = [];
                    this.allParData = {
                        length: 0
                    };
                    this.allParValueList = {
                        length: 0
                    };
                    this.allRec = [];

                    kendo.ui.progress(this.view, true);
                    
                    try {
                        (function (instance: DowntimeTimelineChart) {
                            instance.getAllData(start, end, allEquId, () => {
                                var dataFilterTemplate,
                                    dataFilterRe,
                                    showRecList;

                                $('#data-seg').remove();
                                $('#data-filter').remove();
                                instance.viewModel.set('selectedDataFilter', []);
                                
                                dataFilterTemplate = kendo.template($('#data-filter-list').html());
                                dataFilterRe = dataFilterTemplate(instance.viewModel.get('dataFilterSeries'));
                                $(dataFilterRe).appendTo($('.aic-chart-options'));
                                
                                kendo.bind(instance.view, instance.viewModel);

                                if (instance.allDtData.length > 0) {
                                    showRecList = instance.filterData();
                                    instance._redraw(showRecList);
                                    dtInstance.timeline.setOptions({
                                        start: start,
                                        end: end
                                    });
                                }
                                
                                kendo.ui.progress(instance.view, false);
                            });
                        })(this);
                    } catch (e) {
                        console.log(e);
                    }
                }
        }

        private getAllData(start: Date, end: Date, equId: string[], callback: Function) {
            var instance: DowntimeTimelineChart = <DowntimeTimelineChart>Module.ModuleLoad.getModuleInstance('DowntimeTimelineChart'),
                currentData: DowntimeWithEqp,
                recString;
            instance.serviceContext.V_PPA_DT_RECORD
                .order('DT_START_TIME')
                .filter(function (it) {
                    return (it.EQP_NO in this.equId) && it.DT_START_TIME >= this.start && it.DT_END_TIME <= this.end;
                }, { start: start, end: end, equId: equId })
                .map((it) => {
                    return {
                        recNo: it.REC_NO,
                        startTime: it.DT_START_TIME,
                        endTime: it.DT_END_TIME,
                        dtCause: it.DT_CAU_ID,
                        equNo: it.EQP_NO,
                        equName: it.EQP_NAME,
                        parId: it.PAR_ID,
                        parValue: it.PAR_VALUE,
                        recTime: it.DT_START_TIME
                    }
                })
                .toArray((re) => {
                    if (re.length <= 0) {
                        callback();
                        return;
                    } else {
                        re.forEach(function (it) {
                            currentData = new DowntimeWithEqp(it);
                            recString = currentData.recNo;

                            //根据DEF_ID对原始数据分组
                            if (instance.allRec.indexOf(recString) === -1) {
                                instance.allDtData.push(currentData);
                                instance.allRec.push(recString);
                            }

                            var dataGroup: any[] = instance.viewModel.get('dataFilterSeries');
                            if (it.parId != null) {
                                if (dataGroup.indexOf(it.parId) === -1) {
                                    dataGroup.push(it.parId);
                                    instance.viewModel.set('dataFilterSeries', dataGroup);
                                    instance.allParData.length++;
                                }
                                instance.allParData[it.parId + ""] = instance.allParData[it.parId + ""] || [];
                                instance.allParData[it.parId + ""].push({
                                    recNo: it.recNo,
                                    parValue: it.parValue
                                });
                                instance.allParValueList[it.parId + ""] = instance.allParValueList[it.parId + ""] || [];
                                if (instance.allParValueList[it.parId + ""].indexOf(it.parValue) === -1) {
                                    instance.allParValueList[it.parId + ""].push(it.parValue);
                                }
                            }
                        });

                        if (re.length < 100) {
                            callback();
                            return;
                        } else {
                            start = new Date(re[re.length - 1].startTime.getTime() + 1);
                            this.getAllData(start, end, equId, callback);
                        }
                    }
                }).fail((e) => {
                    callback();
                    return;
                });
        }

        /**
         * 根据参数条件对参数数组进行交叉对比，最后获取符合当前参数筛选的数据数组
         */
        private filterData(): DowntimeWithEqp[]{
            var instance: DowntimeTimelineChart = <DowntimeTimelineChart>Module.ModuleLoad.getModuleInstance('DowntimeTimelineChart'),
                parData = instance.allParData,
                selectedPar: string[] = instance.viewModel.get('selectedDataFilter') || [],
                parNums = selectedPar.length,
                recList: string[] = [],
                result: DowntimeWithEqp[] = [],
                isBreak = false,
                currentList = [],
                i,
                parValue = $('#' + selectedPar[0]).val();

            if (selectedPar.length === 0) {
                return instance.allDtData;
            }

            parData[selectedPar[0]] = parData[selectedPar[0]] || [];
            parData[selectedPar[0]].filter(function (it: { recNo: string, parValue: string }) {
                return it.parValue === parValue;
            }).forEach((it) => {
                recList.push(it.recNo);
            });

            for (i = 1; i < parNums && recList.length > 0; i++) {
                currentList = [];
                parValue = $('#' + selectedPar[i]).val();
                parData[selectedPar[i]].filter(function (it: { recNo: string, parValue: string }) {
                    return it.parValue === parValue;
                }).forEach((it) => {
                    currentList.push(it.recNo);
                });
                if (currentList.length === 0) {
                    recList = [];
                    break;
                } else {
                    recList = recList.filter(function (it) {
                        return currentList.indexOf(it) > -1;
                    });
                    if (recList.length === 0) {
                        break;
                    }
                }
            }

            result = instance.allDtData.filter(function (it: IRecord) {
                return recList.indexOf(it.recNo) > - 1;
            });
            return result;
        }

        private _redraw(allFilterData: DowntimeWithEqp[]) {
            var instance: DowntimeTimelineChart = <DowntimeTimelineChart>Module.ModuleLoad.getModuleInstance('DowntimeTimelineChart');
            instance.dataItems.clear();
            allFilterData.forEach((it) => {
                instance.dataItems.update({
                    id: it.recNo,
                    start: it.startTime,
                    end: it.endTime,
                    group: it.equNo,
                    title: it.equName + "-" + it.dtCause + ": \n" + it.startTime.toDateString() + " - " + it.endTime.toDateString(),
                    className: "vis-item-" + it.dtCause + " aic-vis-item"
                });
            });
           
        }

        init(view: JQuery) {
            super.init(view);
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
        }

        update() {
            super.update();
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
        }

        dispose() {
            super.dispose();
            this.timeline.destroy();
            this.dataItems.clear();
            this.dataGroups.clear();
            kendo.unbind(this.view);
        }
        
    }
}