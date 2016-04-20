/// <reference path="../../../../reference.ts" />

module AicTech.Web.Html {
    export class MaterialYieldRate extends OEEChartBase<any> {
        private allMatYieldData/*: MatRecordDataModel[]*/ = [];

        private allStandardQuantity/*: BOMItem2BOMDataModel[]*/ = [];

        private allMatYieldDataForShow = {
            shiftData: null,
            dateData: null
        };
        private allRec = [];
        private allShift = [];
        private allDate = [];
        private redrawStartPoint;

        private allDefId = [];
        private allDefName = [];

        private isAllStandardQuantityLoaded = false;
        private isAllMatRecordLoaded = false;

        constructor() {
            super([ChartOptionsContent.calcCircle, ChartOptionsContent.dataSegSingle]);
            this.circlePickerSeries = [{
                circleName: '班组',
                circleValue: CircleViews.Shift
            }, {
                circleName: '日',
                circleValue: CircleViews.Day
                }];

            $.extend(this.viewModel, kendo.observable({
                timeTipsStart: "Start",
                timeTipsEnd: "End",
                advanceData: function (e) {
                    (<MaterialYieldRate>Module.ModuleLoad.getModuleInstance('MaterialYieldRate')).redrawChart(RedrawStatu.Advance);
                },
                backoffData: function (e) {
                    (<MaterialYieldRate>Module.ModuleLoad.getModuleInstance('MaterialYieldRate')).redrawChart(RedrawStatu.Advance);
                },
            }));
            this.viewModel.set('selectedCircle', CircleViews.Shift);
        }

        private initWidgets() {
            $('#mat-yield-charts').kendoChart({
                title: {
                    visible: false
                },
                legend: {
                    position: 'top'
                },
                seriesDefaults: {
                    type: 'column',
                    spacing: 0
                },
                series: [{
                    field: 'quantity',
                    name: '计划产量',
                    axis: 'amount'
                }, {
                    field: 'actual',
                    name: '实际产量',
                    axis: 'amount'
                }, {
                    field: 'yieldRate',
                    name: '物料收得率',
                    axis: 'rate',
                    type: 'line',
                    tooltip: {
                        visible: true,
                        template: "#:category# : #:value# %"
                    },
                    color: '#3333CC'
                }],
                categoryAxis: [{
                    field: 'categoryName',
                    axisCrossingValue: [0, 20]
                }],
                valueAxis: [{
                    name: "amount"
                }, {
                    name: "rate",
                    color: "#007EFF"
                }],
                tooltip: {
                    visible: true,
                    template: '#: category#: #:value#'
                }
            });
        }

        /**
         * 数据预处理
         * 计算各个周期的数据
         */
        protected pretreatData(allData/*: MatRecordDataModel[]*/) {
            var instance = <MaterialYieldRate>Module.ModuleLoad.getModuleInstance('MaterialYieldRate'),
                i,
                key,
                length,
                shiftString = "",
                dateString = "",
                tmpShiftDt = {
                    length: 0
                },
                tmpDateDt = {
                    length:0
                },
                tmpAllShiftDt = [],
                tmpAllDateDt = [];
            
            instance.allShift = [];
            instance.allDate = [];
            instance.allMatYieldDataForShow.shiftData = {
                length: 0
            };
            instance.allMatYieldDataForShow.dateData = {
                length: 0
            };

            allData.forEach((it/*: MatRecordDataModel*/) => {
                shiftString = it.shNo + ":" + it.defId;
                dateString = Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd') + ":" + it.defId;
                if (it.matcType === 'c') {
                    //统计班组数据
                    instance.allShift[it.defId] = instance.allShift[it.defId] || [];
                    if (typeof instance.allMatYieldDataForShow.shiftData[shiftString] === 'undefined') {
                        instance.allMatYieldDataForShow.shiftData[shiftString] = {
                            showName: Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shId,
                            recTime: it.recTime,
                            defId: it.defId,
                            cQuantity: it.quantity,
                            mQuantity: 0,
                            k: 0
                        };
                        instance.allMatYieldDataForShow.shiftData.length++;
                        instance.allShift[it.defId].push(shiftString);
                    } else {
                        instance.allMatYieldDataForShow.shiftData[shiftString].cQuantity += it.quantity;
                    }

                    //统计按日计算数据
                    instance.allDate[it.defId] = instance.allDate[it.defId] || [];
                    if (typeof instance.allMatYieldDataForShow.dateData[dateString] === 'undefined') {
                        instance.allMatYieldDataForShow.dateData[dateString] = {
                            showName: Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                            recTime: it.recTime,
                            defId: it.defId,
                            cQuantity: it.quantity,
                            mQuantity: 0,
                            k: 0
                        };
                        instance.allMatYieldDataForShow.dateData.length++;
                        instance.allDate[it.defId].push(dateString);
                    } else {
                        instance.allMatYieldDataForShow.dateData[dateString].cQuantity += it.quantity;
                    }
                } else {
                    //统计班组数据
                    if (typeof tmpShiftDt[shiftString] === 'undefined') {
                        tmpShiftDt[shiftString] = {
                            shiftNo: it.shNo,
                            mQuantity: it.quantity,
                        };
                        tmpShiftDt.length++;
                        tmpAllShiftDt.push(shiftString);
                    } else {
                        tmpShiftDt[shiftString].mQuantity += it.quantity;
                    }

                    //统计按日计算数据
                    if (typeof tmpDateDt[dateString] === 'undefined') {
                        tmpDateDt[dateString] = {
                            date: Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                            mQuantity: 0,
                        };
                        tmpDateDt.length++;
                        tmpAllDateDt.push(dateString);
                    } else {
                        tmpDateDt[dateString].mQuantity += it.quantity;
                    }
                }
            });
            
            for (key in instance.allMatYieldDataForShow.shiftData) {
                if (key === 'length') {
                    continue;
                }
                var shiftNo = key.split(":")[0];
                (function (curentShiftData) {
                    var defId, defIId, re/*: BOMItem2BOMDataModel[]*/;
                    for (var key in tmpShiftDt) {
                        if (key === 'length') {
                            continue;
                        }
                        if (shiftNo === tmpShiftDt[key].shiftNo) {
                            defId = key.split(":")[1];
                            defIId = curentShiftData.defId;
                            curentShiftData.mQuantity = tmpShiftDt[key].mQuantity;

                            re = instance.allStandardQuantity.filter((it) => {
                                return it.bomDefId === defId && it.bomIDefId === defIId;
                            });
                            if (re.length > 0) {
                                curentShiftData.k = re[0].getStandardYieldQuantity();
                            }
                            break;
                        }
                    }
                })(instance.allMatYieldDataForShow.shiftData[key]);
            }

            for (key in instance.allMatYieldDataForShow.dateData) {
                if (key === 'length') {
                    continue;
                }
                var date = key.split(":")[0];
                (function (currentDateData) {
                    var defId, defIId, re/*: BOMItem2BOMDataModel[]*/;
                    for (var key in tmpDateDt) {
                        if (key === 'length') {
                            continue;
                        }
                        if (date === tmpDateDt[key].date) {
                            defId = key.split(":")[1];
                            defIId = currentDateData.defId;
                            currentDateData.mQuantity = tmpDateDt[key].mQuantity;

                            re = instance.allStandardQuantity.filter((it) => {
                                return it.bomDefId === defId && it.bomIDefId === defIId;
                            });
                            if (re.length > 0) {
                                currentDateData.k = re[0].getStandardYieldQuantity();
                            }
                            break;
                        }
                    }
                })(instance.allMatYieldDataForShow.dateData[key]);
            }
        }

        /**
         * 计算重绘参数
         */
        protected redrawChart(redrawStatu = RedrawStatu.Complete) {
            var keyArray = [],
                dataArray = [],
                maxNum,
                currentView = parseInt(this.viewModel.get('selectedCircle')),
                currentDefId = this.allDefId[this.allDefName.indexOf(this.viewModel.get("selectedDataSeg"))];
            switch (currentView) {
                case CircleViews.Shift:
                    keyArray = this.allShift[currentDefId];
                    dataArray = this.allMatYieldDataForShow.shiftData;
                    maxNum = CircleDataNum.Shift;
                    break;
                case CircleViews.Day:
                    keyArray = this.allDate[currentDefId];
                    dataArray = this.allMatYieldDataForShow.dateData;
                    maxNum = CircleDataNum.Day;
                    break;
                default: break;
            }

            switch (redrawStatu) {
                case RedrawStatu.Complete:
                    this.redrawStartPoint = 1;
                    break;
                case RedrawStatu.Backoff:
                    this.redrawStartPoint--;
                    if (this.redrawStartPoint <= 0) {
                        this.redrawStartPoint = 1;
                        alert("已经到最前！");
                        return;
                    }
                    break;
                case RedrawStatu.Advance:
                    this.redrawStartPoint++;
                    if (typeof keyArray)
                        if (this.redrawStartPoint > keyArray.length - maxNum + 1) {
                            this.redrawStartPoint = keyArray.length - maxNum + 1;
                            alert("已经到最后！");
                            return;
                        }
                    break;
                default:
                    this.redrawStartPoint = this.redrawStartPoint || 1;
                    break;
            }

            this._redraw(this.redrawStartPoint, maxNum, keyArray, dataArray);
        }

        protected _redraw(startPoint: number, maxNum: number, keyArray: any[], dataArray: any[]): void {
            var showData = [],
                minDate = new Date(),
                maxDate = new Date('1971-01-01'),
                length,
                i,
                key: string;

            if (typeof keyArray === 'undefined') {
                length = 0;
            } else {
                length = keyArray.length;
            }

            for (i = startPoint - 1; i < length; i++) {
                key = keyArray[i];
                var key1 = key.split(':');
                if (dataArray[key].recTime <= minDate) {
                    minDate = dataArray[key].recTime;
                }
                if (dataArray[key].recTime >= maxDate) {
                    maxDate = dataArray[key].recTime;
                }
                showData.push({
                    categoryName: dataArray[key].showName,
                    quantity: dataArray[key].mQuantity,
                    actual: dataArray[key].cQuantity * dataArray[key].k,
                    yieldRate: (dataArray[key].cQuantity * dataArray[key].k * 100 / dataArray[key].mQuantity).toFixed(2)
                });

                if (showData.length >= maxNum) {
                    break;
                }
            }

            if (showData.length > 0) {
                this.viewModel.set('series', showData);
                this.viewModel.set('timeTipsStart', Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                this.viewModel.set('timeTipsEnd', Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                this.hadData();
            } else {
                this.noData();
            }
        }

        //#region load data
        private loadAllStandardQuantity(bomNo?: number) {
            var instance = <MaterialYieldRate>Module.ModuleLoad.getModuleInstance("MaterialYieldRate"),
                currentData/*: BOMItem2BOMDataModel*/;
            bomNo = isNaN(bomNo) ? -1 : bomNo;

            instance.serviceContext.V_MM_BOM_DETAIL
                .order('BOM_NO')
                .filter(function (it) {
                    return it.BOM_NO > this.bomNo;
                }, { bomNo: bomNo })
                .map((it) => {
                    return {
                        bomNo: it.BOM_NO,
                        bomDefNo: it.DEF_NO,
                        bomDefId: it.DEF_ID,
                        bomDefName: it.DEF_NAME,
                        bomIDefNo: it.IDEF_NO,
                        bomIDefId: it.IDEF_ID,
                        bomIDefName: it.IDEF_NAME,
                        rate: it.RATIO,
                        yield: it.YIELD
                    };
                })
                .toArray((re) => {
                    re.forEach((it) => {
                        //currentData = new BOMItem2BOMDataModel(it);
                        instance.allStandardQuantity.push(currentData);
                        instance.allDefId.push(it.bomIDefId);
                        instance.allDefName.push(it.bomIDefName);
                    })
                    if (re.length >= 100) {
                        instance.loadAllStandardQuantity(parseInt(re[99].bomNo));
                    } else {
                        instance.isAllStandardQuantityLoaded = true;
                        instance.tryToPaintChart();
                    }
                }).fail((e) => {
                    console.log('Failed when loaded standard quantity, ', e);
                });
        }

        private loadAllMatRecord(startTime: Date, endTime: Date, equNo: string) {
            var instance = <MaterialYieldRate>Module.ModuleLoad.getModuleInstance("MaterialYieldRate"),
                //currentData: MatRecordDataModel,
                startTime: Date,
                endTime: Date,
                recString;
            
            startTime = startTime || Utils.DateUtils.lastDay(new Date());
            endTime = endTime || new Date();

            instance.serviceContext.V_PPA_MAT_RECORD
                .order('D_RECORD')
                .filter(function (it) {
                    return it.EQP_NO == this.equNo && it.D_RECORD >= this.start && it.D_RECORD <= this.end && (it.MATC_TYPE == "c" || it.MATC_TYPE == "m") && it.DEF_ID != null;
                }, { equNo: equNo, start: startTime, end: endTime })
                .toArray((re) => {
                    re.forEach((it) => {
                        recString = it.REC_NO + ":" + it.DEF_ID;
                        //currentData = new MatRecordDataModel({
                        //    recTime: it.D_RECORD,
                        //    matcType: it.MATC_TYPE,
                        //    defId: it.DEF_ID,
                        //    poId: it.PO_ID,
                        //    quantity: it.QUANTITY,
                        //    shId: it.SH_ID,
                        //    shNo: it.SH_NO
                        //});
                        //instance.allRec = instance.allRec || [];
                        //if (instance.allRec.indexOf(recString) === -1) {
                        //    instance.allMatYieldData.push(currentData);
                        //    instance.allRec.push(recString);
                        //}
                    });


                    if (re.length >= 100) {
                        startTime = new Date(re[99].D_RECORD.getTime() + 1);
                        instance.loadAllMatRecord(startTime, endTime, equNo);
                    } else {
                        instance.isAllMatRecordLoaded = true;
                        instance.tryToPaintChart();
                    }
                }).fail((e) => {
                    console.log('Failed when loaded MatRecord, ', e);
                });
        }
        //#endregion


        private loadAllData() {
            var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                end = this.endTime || new Date();

            this.allStandardQuantity = [];
            this.allDefId = [];
            this.allDefName = [];
            this.loadAllStandardQuantity();

            this.allMatYieldData = [];
            if (typeof this.equipId === 'undefined' || this.equipId === '') {
                return;
            }
            kendo.ui.progress(this.view, true);
            this.loadAllMatRecord(start, end, this.equipId);
        }

        private tryToPaintChart() {
            var dataSegTemplate,
                dataSegRe;
            if (this.isAllDataLoaded()) {
                kendo.ui.progress(this.view, false);
                $('#data-seg-single').remove();
                dataSegTemplate = kendo.template($('#data-seg-single-list').html());
                dataSegRe = dataSegTemplate(this.allDefName);
                $(dataSegRe).insertBefore($('#count-circle'));
                kendo.bind(this.view, this.viewModel);
                this.viewModel.set('selectedDataSeg', this.allDefName[0]);
                this.pretreatData(this.allMatYieldData);
                this.redrawChart();
            }
        }

        private isAllDataLoaded(): boolean {
            return this.isAllMatRecordLoaded && this.isAllStandardQuantityLoaded;
        }

        init(view: JQuery): void {
            super.init(view);
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.loadAllData();
        }

        update(): void {
            super.update();
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.loadAllData();
        }

        dispose(): void {
            super.dispose();
            var chart = $('#mat-yield-charts').data('kendoChart');
            kendo.unbind(this.view);
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            this.isAllMatRecordLoaded = false;
            this.isAllStandardQuantityLoaded = false;
            this.allMatYieldData = [];
            this.allMatYieldDataForShow = {
                dateData: null,
                shiftData: null
            };
            this.allDefName = [];
            this.allDefId = [];
            this.viewModel.set('selectedCircle', CircleViews.Shift);
            this.noData();
        }
    }
}