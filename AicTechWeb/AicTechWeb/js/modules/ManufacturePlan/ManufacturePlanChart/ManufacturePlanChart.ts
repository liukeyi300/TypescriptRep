/// <reference path="../../../reference.ts" />

module AicTech.Web.Html {
    export class ManufacturePlanChart extends Module.ModuleBase {
        private allPoPlan = [];
        private allDefName = [];
        private currentDataItem;
        private selectedTr: JQuery;
        private dirtyPoPlan = {
            length: 0
        };

        private defaultGridOptions: kendo.ui.GridOptions = {
            height: "100%",
            scrollable: true,
            navigatable: true,
            sortable: true,
            resizable: true,
            messages: {
                commands: {
                    cancel: "撤销",
                    canceledit: "取消",
                    create: "添加",
                    destroy: "删除",
                    edit: "编辑",
                    save: "保存",
                    select: "Select",
                    update: "更新"
                }
            }
        };

        constructor() {
            super();
            this.needEquiptree = false;
            $.extend(this.viewModel, kendo.observable({
                poPlanSource: [],
                poDetailSource: [],
                allDefId: [],
                allSh: [],
                poSaveData: function (e) {
                    var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance("ManufacturePlanChart"),
                        key,
                        i: number,
                        allCurrentData: any[] = this.get('poPlanSource'),
                        length = allCurrentData.length,
                        rowData: PPAModel.EXT_PP_POS,
                        addData = [],
                        data;

                    for (i = 0; i < length; i++) {
                        if (typeof instance.dirtyPoPlan[allCurrentData[i].ppsNo] !== "undefined") {
                            key = allCurrentData[i].ppsNo;
                            if (instance.dirtyPoPlan[key] === DirtyDataStatus.Add) {
                                addData.push(allCurrentData[i]);
                            } else if (instance.dirtyPoPlan[key] === DirtyDataStatus.Modify) {
                                if (instance.isReallyChange(allCurrentData[i])) {
                                    rowData = instance.allPoPlan[key];
                                    instance.serviceContext.EXT_PP_POS.attach(rowData);
                                    rowData.SH_NO = allCurrentData[i].shNo;
                                    //rowData.PO_NO = allCurrentData[i].poNo;
                                    //rowData.d = allCurrentData[i].defId;
                                    rowData.QUANTITY = allCurrentData[i].quantity;
                                    rowData.UOM_ID = allCurrentData[i].uomId;
                                    rowData.START_TIME = allCurrentData[i].startTime;
                                    rowData.END_TIME = allCurrentData[i].endTime;
                                    rowData.EXT_MAT_ID = allCurrentData[i].extMatId;
                                }
                            }
                        }
                    }
                    for (key in instance.dirtyPoPlan) {
                        if (key === 'length' || instance.dirtyPoPlan[key] !== DirtyDataStatus.Delete || key.slice(0, 6) === "Create") {
                            continue;
                        }
                        rowData = instance.allPoPlan[key];
                        instance.serviceContext.EXT_PP_POS.remove(rowData);
                        delete instance.allPoPlan[key];
                    }
                    instance.serviceContext.saveChanges();
                    if (addData.length > 0) {
                        instance.serviceContext.GetSequenceNextValues("PPA_SEQ_NO", addData.length, (valus: string[]) => {
                            for (i = 0, length = addData.length; i < length; i++) {
                                data = addData[i];
                                rowData = new PPAModel.EXT_PP_POS({
                                    PPS_NO: valus[i] + "",
                                    SH_NO: data.shNo,
                                    PO_ID: data.poId,
                                    DEF_ID: data.defId,
                                    QUANTITY: data.quantity,
                                    UOM_ID: data.uomId,
                                    START_TIME: data.startTime,
                                    END_TIME: data.endTime,
                                    EXT_MAT_ID: data.extMatId
                                });
                                instance.serviceContext.EXT_PP_POS.add(rowData);
                                instance.allPoPlan[valus[i]] = rowData;
                                for (var j = 0, max = instance.viewModel.get('poPlanSource').length; j < max; j++) {
                                    if (instance.viewModel.get("poPlanSource[" + j + "].ppsNo") === data.ppsNo) {
                                        instance.viewModel.set("poPlanSource[" + j + "].ppsNo", valus[i]);
                                    }
                                }
                            }
                            instance.serviceContext.saveChanges();
                        });
                    }
                    rowData = null;
                    instance.dirtyPoPlan = {
                        length: 0
                    };
                },
                poDataDirtyBySave: function (e) {
                    var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance("ManufacturePlanChart");
                    instance.dirtyPoPlan = instance.dirtyPoPlan || [];
                    if (typeof e.model.ppsNo === 'undefined') {
                        e.model.ppsNo = "Create" + instance.dirtyPoPlan.length;
                        instance.dirtyPoPlan[e.model.ppsNo] = DirtyDataStatus.Add;
                        instance.dirtyPoPlan.length++;
                    } else {
                        if (typeof instance.dirtyPoPlan[e.model.ppsNo] === 'undefined') {
                            instance.dirtyPoPlan[e.model.ppsNo] = DirtyDataStatus.Modify;
                            instance.dirtyPoPlan.length++;
                        }
                    }
                },
                poDataDirtyByDelete: function (e) {
                    var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance("ManufacturePlanChart");
                    instance.dirtyPoPlan[e.model.ppsNo] = DirtyDataStatus.Delete;
                },
                queryShift: function (e) {
                    var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                        startSelect = $('#startTime').data('kendoDateTimePicker'),
                        endSelect = $('#endTime').data('kendoDateTimePicker'),
                        startTime = startSelect.value(),
                        endTime = endSelect.value();
                    this.set('allSh', []);
                    instance.getAllShiftData(startTime, endTime);
                },
                selectedASh: function (e) {
                    var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                        grid = $('#sh-grid').data('kendoGrid');
                    instance.selectedTr = grid.select();
                },
                shSelectCommit: function (e) {
                    var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                        grid = $('#po-plan').data('kendoGrid'),
                        shGrid = $('#sh-grid').data('kendoGrid');
                    $('#sh-selected-modal').modal('hide');
                    if (instance.selectedTr == null) {
                        alert("当前没有选择任何班组！");
                        return;
                    } else {
                        instance.currentDataItem.set('shNo', shGrid.dataItem(instance.selectedTr).get('SH_NO'));
                        instance.currentDataItem.set('shId', shGrid.dataItem(instance.selectedTr).get('SH_ID'));
                        instance.currentDataItem.set('teamId', shGrid.dataItem(instance.selectedTr).get('TEAM_ID'));
                        instance.currentDataItem.set('shStartTime', shGrid.dataItem(instance.selectedTr).get('START_TIME'));
                        instance.currentDataItem.set('shEndTime', shGrid.dataItem(instance.selectedTr).get('END_TIME'));
                    }
                }
            }));
        }

        private initWidgets() {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                poPlanGrid,
                poDetail,
                shGrid;

            $('#po-plan').kendoGrid({
                pageable: {
                    pageSize: 20,
                    input: true,
                    numeric: false
                },
                editable: {
                    confirmation:"确定删除？"
                },
                toolbar: [
                    { template: kendo.template('<span class="grid-title">工单排程</span>') },
                    { name: "create"},
                    { name: "save" }
                ],
                columns: [
                    { field: 'poId', title: '工单' },
                    {
                        field: 'defId', title: '物料', editor: function (container, options) {
                            var input = $('<input name="' + options.field + '" required="required" data-bind="source:allDefId" />');
                            input.appendTo(container);
                            input.kendoDropDownList();
                        }
                    },
                    {
                        field: 'shId', title: '班次', editor: function (container, options) {
                            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                                grid = $('#po-plan').data('kendoGrid'),
                                shGrid = $('#sh-grid').data('kendoGrid');
                            instance.currentDataItem = grid.dataItem($(container).parents('tr'));
                            instance.selectedTr = null;
                            instance.viewModel.set('allSh', []);
                            shGrid.refresh();
                            $('#sh-selected-modal').modal('show');
                        }
                    },
                    { field: 'quantity', title: '数量' },
                    {
                        field: 'uomId', title: '单位', editor: function (container, options) {
                            var input = $('<input name="' + options.field + '" required="required" />');
                            input.appendTo(container);
                            input.kendoDropDownList({
                                dataSource: {
                                    data: StartUp.Instance.allUOMID
                                }
                            });
                        }
                    },
                    {
                        field: 'startTime', title: '计划开始', format:"{0:MM-dd HH:mm}", editor: function (container, options) {
                            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                                grid = $('#po-plan').data('kendoGrid'),
                                input = $('<input name="' + options.field + '" />'),
                                minDate: Date,
                                maxDate: Date,
                                shId = grid.dataItem($(container).parents('tr')).get('shId'),
                                endTime = grid.dataItem($(container).parents('tr')).get('endTime'),
                                shEndTime = grid.dataItem($(container).parents('tr')).get('shEndTime');

                            if (typeof shId === 'undefined' || shId === "") {
                                return;
                            }

                            minDate = grid.dataItem($(container).parents('tr')).get('shStartTime');
                            maxDate = endTime == null ? shEndTime : (endTime < shEndTime ? endTime : shEndTime);

                            input.appendTo(container);
                            input.kendoDateTimePicker({
                                min: minDate,
                                max: maxDate
                            });
                        }
                    },
                    {
                        field: 'endTime', title: '计划结束', format:"{0:MM-dd HH:mm}",  editor: function (container, options) {
                            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                                grid = $('#po-plan').data('kendoGrid'),
                                input = $('<input name="' + options.field + '" />'),
                                minDate: Date,
                                maxDate: Date,
                                shId = grid.dataItem($(container).parents('tr')).get('shId'),
                                startTime = grid.dataItem($(container).parents('tr')).get('startTime'),
                                shStartTime = grid.dataItem($(container).parents('tr')).get('shStartTime');

                            if (typeof shId === 'undefined' || shId === "") {
                                return;
                            }

                            minDate = startTime == null ? shStartTime : (startTime > shStartTime ? startTime : shStartTime);
                            maxDate = grid.dataItem($(container).parents('tr')).get('shEndTime');

                            input.appendTo(container);
                            input.kendoDateTimePicker({
                                min: minDate,
                                max: maxDate
                            });
                        }
                    },
                    { field: 'extMatId', title: '批次号' },
                    { command:"destroy", title: "&nbsp;", width: "85px" }
                ]
            });
            poPlanGrid = $('#po-plan').data('kendoGrid');
            poPlanGrid.setOptions(instance.defaultGridOptions);
            poPlanGrid.refresh();

            $('#po-detail').kendoGrid({
                pageable: {
                    pageSize: 20,
                    input: true,
                    numeric: false
                },
                columns: [
                    { field: 'poId', title: '工单' },
                    { field: 'defId', title: '物料' },
                    { field: 'shId', title: '班次' },
                    { field: 'teamId', title: '班组' },
                    { field: 'quantity', title: '数量' },
                    { field: 'uomId', title: '单位' },
                    { field: 'startTime', title: '计划开始', format: "{0:MM-dd HH:mm}"  },
                    { field: 'endTime', title: '计划结束', format: "{0:MM-dd HH:mm}"  },
                    { field: 'extMatId', title:'批次号' }
                ]
            });
            poDetail = $('#po-detail').data('kendoGrid');
            poDetail.setOptions(instance.defaultGridOptions);
            poDetail.refresh();

            $('#startTime').kendoDateTimePicker({
                format: "yyyy/MM/dd HH:mm",
                timeFormat: "HH:mm"
            });

            $('#endTime').kendoDateTimePicker({
                format: "yyyy/MM/dd HH:mm",
                timeFormat: "HH:mm"
            })

            $('#sh-grid').kendoGrid({
                pageable: {
                    pageSize: 20,
                    input: true,
                    numeric: false
                },
                selectable: 'row',
                editable: false,
                columns: [
                    { field: 'SH_ID', title: '班次' },
                    { field: 'START_TIME', title: '开始时间', format: "{0:MM-dd HH:mm}" },
                    { field: 'END_TIME', title: '结束时间', format:"{0:MM-dd HH:mm}" },
                    { field: 'TEAM_ID', title: '班次' }
                ]
            });
            shGrid = $('#sh-grid').data('kendoGrid');
            shGrid.setOptions(instance.defaultGridOptions);
            shGrid.refresh();
        }

        private eventBinding() {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance("ManufacturePlanChart");
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                kendo.ui.progress(instance.view, true);
                if (instance.view.find('li.active').attr('id') === 'po-plan-act') {
                    instance.viewModel.set('poPlanSource', []);
                    instance.loadPoPlan();
                } else {
                    instance.viewModel.set('poDetailSource', []);
                    instance.loadPoDetailData(instance.startTime, instance.endTime);
                }
                var divs = $($(e.target).attr('href') + ">div>div"),
                    datagrid;
                divs.each(function () {
                    datagrid = $(this).data('kendoGrid');
                    datagrid.refresh();
                });
            });
        }

        private isReallyChange(data) {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance("ManufacturePlanChart");
            return !((typeof instance.allPoPlan[data.ppsNo] !== "undefined") &&
                (instance.allPoPlan[data.ppsNo].SH_NO === data.shNo) &&
                (instance.allPoPlan[data.ppsNo].PO_ID === data.poId) &&
                (instance.allPoPlan[data.ppsNo].EXT_MAT_ID === data.extMatId) &&
                (instance.allPoPlan[data.ppsNo].DEF_ID === data.defId) &&
                (instance.allPoPlan[data.ppsNo].UOM_ID === data.uomId) &&
                (instance.allPoPlan[data.ppsNo].QUANTITY === data.quantity) &&
                (instance.allPoPlan[data.ppsNo].START_TIME === data.startTime) &&
                (instance.allPoPlan[data.ppsNo].END_TIME === data.endTime));
        }

        //#region load data
        private loadAllDefId(defNo?: number) {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance("ManufacturePlanChart");
            defNo = isNaN(defNo) ? -1 : defNo;
            instance.serviceContext.MM_DEFINITION
                .order('DEF_NO')
                .filter(function (it) {
                    return it.DEF_NO > this.defNo;
                }, { defNo: defNo })
                .toArray((re) => {
                    var allData: any[] = instance.viewModel.get('allDefId') || [];
                    instance.allDefName = instance.allDefName || [];
                    re.forEach((it) => {
                        allData.push(it.DEF_ID);
                        instance.allDefName.push(it.DEF_NAME);
                    });
                    instance.viewModel.set('allDefName', allData);
                    if (re.length >= 100) {
                        instance.loadAllDefId(parseInt(re[99].DEF_NO));
                    }
                }).fail((e) => {
                    console.log('Load all Def Id', e);
                });
        }

        private loadPoDetailData(startTime?: Date, endTime?: Date) {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart');

            startTime = startTime || Utils.DateUtils.lastDay(new Date());
            endTime = endTime || new Date();
            instance.serviceContext.EXT_PP_POS
                .order('START_TIME')
                .include('PPA_SHIFT')
                .filter(function (it) {
                    return (it.START_TIME >= this.start && it.START_TIME <= this.end) || (it.START_TIME == null);
                }, { start: startTime, end: endTime })
                .toArray((re) => {
                    var allData: any[] = instance.viewModel.get('poDetailSource') || [];
                    re.forEach((it) => {
                        allData.push({
                            //poId: it.PO_ID,
                            //defId: it.DEF_ID,
                            shId: it.SH_NO !== null ? it.PPA_SHIFT.SH_ID : null,
                            teamId: it.SH_NO !== null ? it.PPA_SHIFT.TEAM_ID : null,
                            quantity: it.QUANTITY,
                            uomId: it.UOM_ID,
                            startTime: it.START_TIME,
                            endTime: it.END_TIME,
                            extMatId: it.EXT_MAT_ID
                        });
                    });
                    instance.viewModel.set('poDetailSource', allData);
                    if (re.length >= 100) {
                        startTime = new Date(re[99].START_TIME.getTime() + 1);
                        instance.loadPoDetailData(startTime, endTime);
                    } else {
                        kendo.ui.progress(instance.view, false);
                    }
                }).fail((e) => {
                    console.log('Load Po Detail, ', e);
                });
        }

        private loadPoPlan(ppsNo?: number) {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart');
            ppsNo = isNaN(ppsNo) ? -1 : ppsNo;
            instance.serviceContext.EXT_PP_POS
                .order('PPS_NO')
                .include('PPA_SHIFT')
                .filter(function (it) {
                    return it.SH_NO == null && it.PPS_NO > this.ppsNo;
                }, { ppsNo: ppsNo })
                .toArray((re) => {
                    var allData: any[] = instance.viewModel.get('poPlanSource') || [];
                    re.forEach((it) => {
                        instance.allPoPlan[it.PPS_NO] = it;
                        allData.push({
                            ppsNo: it.PPS_NO,
                            //poId: it.PO_ID,
                            //defId: it.DEF_ID,
                            shNo:"",
                            shId: "",
                            teamId: "",
                            quantity: it.QUANTITY,
                            uomId: it.UOM_ID,
                            startTime: it.START_TIME === null ? null : it.START_TIME,
                            endTime: it.END_TIME === null ? null : it.END_TIME,
                            extMatId: it.EXT_MAT_ID,
                            shStartTime: null,
                            shEndTime: null
                        });
                    });
                    instance.viewModel.set('poPlanSource', allData);
                    if (re.length >= 100) {
                        instance.loadPoPlan(parseInt(re[99].PPS_NO));
                    } else {
                        kendo.ui.progress(instance.view, false);
                    }
                }).fail((e) => {
                    console.log('Load Po Plan, ', e);
                });
        }

        private getAllShiftData(startTime: Date, endTime: Date) {
            var instance = <ManufacturePlanChart>Module.ModuleLoad.getModuleInstance('ManufacturePlanChart'),
                currentSh;
            startTime = startTime || Utils.DateUtils.lastDay(new Date());
            endTime = endTime || new Date();

            instance.serviceContext.PPA_SHIFT
                .order('START_TIME')
                .filter(function (it) {
                return it.START_TIME >= this.start && it.START_TIME <= this.end;
                }, { start: startTime, end: endTime })
                .toArray((re) => {
                currentSh = instance.viewModel.get('allSh') || [];
                re.forEach((it) => {
                    currentSh.push(it);
                })
                instance.viewModel.set('allSh', currentSh);
                if (re.length >= 100) {
                    startTime = new Date(re[99].START_TIME.getTime() + 1);
                    instance.getAllShiftData(startTime, endTime);
                } else {
                    var grid = $('#sh-grid').data('kendoGrid');
                    grid.refresh();
                }
                })
        }
        //#endregion
        
        //#region override methods
        refreshData() {
            super.refreshData();
            kendo.ui.progress(this.view, true);
            this.loadAllDefId();
            this.loadPoDetailData(this.startTime, this.endTime);
            this.loadPoPlan();
        }

        init(view: JQuery): void {
            super.init(view);
            this.initWidgets();
            this.eventBinding();
            this.refreshData();
            kendo.bind(this.view, this.viewModel);
        }

        update(): void {
            super.update();
            this.initWidgets();
            this.eventBinding();
            this.refreshData();
            kendo.bind(this.view, this.viewModel);
        }

        dispose(): void {
            super.dispose();
            var poGrid = $('#po-plan').data("kendoGrid"),
                poDetail = $('#po-detail').data('kendoGrid');

            if (typeof poGrid !== 'undefined') {
                poGrid.destroy();
            }
            if (typeof poDetail !== 'undefined') {
                poDetail.destroy();
            }

            this.viewModel.set('allDefId', []);
            this.viewModel.set('poPlanSource', []);
            this.viewModel.set('poDetailSource', []);
        }
        //#endregion
    }
}