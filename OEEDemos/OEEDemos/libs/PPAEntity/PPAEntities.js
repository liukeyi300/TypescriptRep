﻿

/*//////////////////////////////////////////////////////////////////////////////////////
////// Autogenerated by JaySvcUtil.exe http://JayData.org for more info        /////////
//////                             oData  V2                                     /////////
//////////////////////////////////////////////////////////////////////////////////////*/
(function(global, $data, undefined) {

    
  $data.Entity.extend('PPAModel.EXT_PP_POS', {
     'PPS_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'POS': { 'type':'Edm.Int16','nullable':false,'required':true },
     'PO_ID': { 'type':'Edm.String','maxLength':64 },
     'EXT_MAT_ID': { 'type':'Edm.String','maxLength':64 },
     'DEF_ID': { 'type':'Edm.String','maxLength':64 },
     'UOM_ID': { 'type':'Edm.String','maxLength':64 },
     'QUANTITY': { 'type':'Edm.Decimal' },
     'EXT_PRD_PLAN': { 'type':'PPAModel.EXT_PRD_PLAN','required':true,'inverseProperty':'EXT_PP_POS' }
  });

  $data.Entity.extend('PPAModel.EXT_PRD_PLAN', {
     'PP_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EXT_PP_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'SH_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'EXT_PP_POS': { 'type':'Array','elementType':'PPAModel.EXT_PP_POS','inverseProperty':'EXT_PRD_PLAN' }
  });

  $data.Entity.extend('PPAModel.MD_CALCULATION', {
     'CALC_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'DESCRIPTION': { 'type':'Edm.String','maxLength':512 },
     'PROGRAM': { 'type':'Edm.String','maxLength':Number.POSITIVE_INFINITY }
  });

  $data.Entity.extend('PPAModel.MD_CONFIGURATION', {
     'CFG_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':255 },
     'CFG_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'CFG_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'OBJ_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'OBJ_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'CFG_VALUE': { 'type':'Edm.String','maxLength':Number.POSITIVE_INFINITY }
  });

  $data.Entity.extend('PPAModel.MD_DOM_VALUE', {
     'DOM_VAL_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'DOM_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'VALUE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':700 },
     'DESCRIPTION': { 'type':'Edm.String','maxLength':512 },
     'DOM_VAL_POS': { 'type':'Edm.Int16' },
     'MD_DOMAIN': { 'type':'PPAModel.MD_DOMAIN','required':true,'inverseProperty':'MD_DOM_VALUE' }
  });

  $data.Entity.extend('PPAModel.MD_DOMAIN', {
     'DOM_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'DOM_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'UOM_ID': { 'type':'Edm.String','maxLength':64 },
     'MD_DOM_VALUE': { 'type':'Array','elementType':'PPAModel.MD_DOM_VALUE','inverseProperty':'MD_DOMAIN' }
  });

  $data.Entity.extend('PPAModel.MD_DT_CAUSE', {
     'DT_CAU_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'DT_CLS_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'DESCRIPTION': { 'type':'Edm.String','maxLength':512 },
     'MD_DT_CLASS': { 'type':'PPAModel.MD_DT_CLASS','required':true,'inverseProperty':'MD_DT_CAUSE' }
  });

  $data.Entity.extend('PPAModel.MD_DT_CLASS', {
     'DT_CLS_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'DESCRIPTION': { 'type':'Edm.String','maxLength':512 },
     'MD_DT_CAUSE': { 'type':'Array','elementType':'PPAModel.MD_DT_CAUSE','inverseProperty':'MD_DT_CLASS' }
  });

  $data.Entity.extend('PPAModel.MD_PAR_CATEGORY', {
     'PAR_CAT_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PAR_CAT_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_CAT_NAME': { 'type':'Edm.String','maxLength':128 }
  });

  $data.Entity.extend('PPAModel.MD_PAR_CLASSIFICATION', {
     'PAR_CLF_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_CAT_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PAR_POS': { 'type':'Edm.Int16' }
  });

  $data.Entity.extend('PPAModel.MD_PARAMETER', {
     'PAR_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'DATA_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'PAR_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'DISPLAY_LEN': { 'type':'Edm.Int16' },
     'DISPLAY_NAME': { 'type':'Edm.String','maxLength':128 },
     'DOM_ID': { 'type':'Edm.String','maxLength':64 },
     'UOM_ID': { 'type':'Edm.String','maxLength':64 }
  });

  $data.Entity.extend('PPAModel.MD_UNITS_OF_MEASURE', {
     'UOM_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'OBJ_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'UOM_TEXT': { 'type':'Edm.String','maxLength':512 }
  });

  $data.Entity.extend('PPAModel.PM_CFG_TEMPLATE', {
     'TMPL_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'TMPL_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'TMPL_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'REMARK': { 'type':'Edm.String','maxLength':512 }
  });

  $data.Entity.extend('PPAModel.PM_EQP_CALCULATION', {
     'EQP_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'AVA_CALC_ID': { 'type':'Edm.String','maxLength':64 },
     'PER_CALC_ID': { 'type':'Edm.String','maxLength':64 },
     'QA_CALC_ID': { 'type':'Edm.String','maxLength':64 }
  });

  $data.Entity.extend('PPAModel.PM_EQP_CLASS', {
     'CLS_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'CLS_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'CLS_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'IS_TEMPLATE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'PARENT_NO': { 'type':'Edm.Decimal' },
     'MASTER_NO': { 'type':'Edm.Decimal' },
     'EQP_LEVEL': { 'type':'Edm.Int16','nullable':false,'required':true },
     'LIB_NO': { 'type':'Edm.Decimal' },
     'REMARK': { 'type':'Edm.String','maxLength':512 },
     'PM_EQP_CLS_PROPERTY': { 'type':'Array','elementType':'PPAModel.PM_EQP_CLS_PROPERTY','inverseProperty':'PM_EQP_CLASS' }
  });

  $data.Entity.extend('PPAModel.PM_EQP_CLS_PROPERTY', {
     'CLS_PRP_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'CLS_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'PM_EQP_CLASS': { 'type':'PPAModel.PM_EQP_CLASS','required':true,'inverseProperty':'PM_EQP_CLS_PROPERTY' }
  });

  $data.Entity.extend('PPAModel.PM_EQP_PROPERTY', {
     'EQP_PRP_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'TAG_NO': { 'type':'Edm.Decimal' },
     'PM_EQUIPMENT': { 'type':'PPAModel.PM_EQUIPMENT','required':true,'inverseProperty':'PM_EQP_PROPERTY' }
  });

  $data.Entity.extend('PPAModel.PM_EQUIPMENT', {
     'EQP_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'EQP_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'EQP_TYPE': { 'type':'Edm.String','maxLength':1 },
     'CLS_NO': { 'type':'Edm.Decimal' },
     'MASTER_NO': { 'type':'Edm.Decimal' },
     'MAX_CAPACITY': { 'type':'Edm.Decimal' },
     'RT_TAG': { 'type':'Edm.String','maxLength':255 },
     'PM_EQP_PROPERTY': { 'type':'Array','elementType':'PPAModel.PM_EQP_PROPERTY','inverseProperty':'PM_EQUIPMENT' }
  });

  $data.Entity.extend('PPAModel.PM_PER_DETAIL', {
     'PDTL_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PER_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'START_TIME': { 'type':'Edm.Int16','nullable':false,'required':true },
     'END_TIME': { 'type':'Edm.Int16','nullable':false,'required':true },
     'PRD_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'PM_PERIOD': { 'type':'PPAModel.PM_PERIOD','required':true,'inverseProperty':'PM_PER_DETAIL' }
  });

  $data.Entity.extend('PPAModel.PM_PERIOD', {
     'PER_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PER_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'SH_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'START_TIME': { 'type':'Edm.Int16','nullable':false,'required':true },
     'END_TIME': { 'type':'Edm.Int16','nullable':false,'required':true },
     'PM_PER_DETAIL': { 'type':'Array','elementType':'PPAModel.PM_PER_DETAIL','inverseProperty':'PM_PERIOD' },
     'PM_SHIFT': { 'type':'PPAModel.PM_SHIFT','required':true,'inverseProperty':'PM_PERIOD' }
  });

  $data.Entity.extend('PPAModel.PM_SHIFT', {
     'SH_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'SH_END': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'SH_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'SH_START': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PM_PERIOD': { 'type':'Array','elementType':'PPAModel.PM_PERIOD','inverseProperty':'PM_SHIFT' }
  });

  $data.Entity.extend('PPAModel.PM_SHIFT_PATTERN', {
     'SHP_ID': { 'key':true,'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'SHP_LEN': { 'type':'Edm.Int16','nullable':false,'required':true },
     'SHP_NAME': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':128 },
     'PM_SHP_CYCLES': { 'type':'Array','elementType':'PPAModel.PM_SHP_CYCLES','inverseProperty':'PM_SHIFT_PATTERN' }
  });

  $data.Entity.extend('PPAModel.PM_SHP_CYCLES', {
     'SHP_CYCLE_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'SHP_CYCLE_LEN': { 'type':'Edm.Int16','nullable':false,'required':true },
     'SHP_CYCLE_POS': { 'type':'Edm.Int16','nullable':false,'required':true },
     'SHP_CYCLE_START': { 'type':'Edm.Int16','nullable':false,'required':true },
     'SHP_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'SH_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PM_SHIFT_PATTERN': { 'type':'PPAModel.PM_SHIFT_PATTERN','required':true,'inverseProperty':'PM_SHP_CYCLES' }
  });

  $data.Entity.extend('PPAModel.PPA_CALENDAR', {
     'CALD_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'CALD_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'SHP_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 }
  });

  $data.Entity.extend('PPAModel.PPA_DT_RECORD', {
     'REC_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'D_RECORD': { 'type':'Edm.DateTime' },
     'DT_START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'DT_END_TIME': { 'type':'Edm.DateTime' },
     'DT_CAU_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PROCESSED': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'D_UPDATE': { 'type':'Edm.DateTime' },
     'D_CALCULATE': { 'type':'Edm.DateTime' },
     'OPERATOR': { 'type':'Edm.String','maxLength':128 },
     'PPA_DTR_PARAMETER': { 'type':'Array','elementType':'PPAModel.PPA_DTR_PARAMETER','inverseProperty':'PPA_DT_RECORD' }
  });

  $data.Entity.extend('PPAModel.PPA_DTR_PARAMETER', {
     'PV_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':10 },
     'REC_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'PPA_DT_RECORD': { 'type':'PPAModel.PPA_DT_RECORD','required':true,'inverseProperty':'PPA_DTR_PARAMETER' }
  });

  $data.Entity.extend('PPAModel.PPA_ENG_RECORD', {
     'REC_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'D_RECORD': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'ENGC_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'SH_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'BATCH_ID': { 'type':'Edm.String','maxLength':64 },
     'ENG_ID': { 'type':'Edm.String','maxLength':64 },
     'QUANTITY': { 'type':'Edm.Decimal' },
     'PROCESSED': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'D_UPDATE': { 'type':'Edm.DateTime' },
     'OPERATOR': { 'type':'Edm.String','maxLength':128 },
     'PPA_ENGR_PARAMETER': { 'type':'Array','elementType':'PPAModel.PPA_ENGR_PARAMETER','inverseProperty':'PPA_ENG_RECORD' }
  });

  $data.Entity.extend('PPAModel.PPA_ENGR_PARAMETER', {
     'PV_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':10 },
     'REC_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'PPA_ENG_RECORD': { 'type':'PPAModel.PPA_ENG_RECORD','required':true,'inverseProperty':'PPA_ENGR_PARAMETER' }
  });

  $data.Entity.extend('PPAModel.PPA_EQP_CALENDAR', {
     'OBJ_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'CALD_NO': { 'type':'Edm.Decimal','nullable':false,'required':true }
  });

  $data.Entity.extend('PPAModel.PPA_MAT_RECORD', {
     'REC_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'D_RECORD': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'MATC_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'SHF_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'MAT_TYPE': { 'type':'Edm.String','maxLength':5 },
     'EXT_MAT_ID': { 'type':'Edm.String','maxLength':64 },
     'DEF_ID': { 'type':'Edm.String','maxLength':64 },
     'UOM_ID': { 'type':'Edm.String','maxLength':64 },
     'PO_ID': { 'type':'Edm.String','maxLength':64 },
     'QUANTITY': { 'type':'Edm.Decimal' },
     'PROCESSED': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'D_UPDATE': { 'type':'Edm.DateTime' },
     'OPERATOR': { 'type':'Edm.String','maxLength':128 },
     'PPA_MATR_PARAMETER': { 'type':'Array','elementType':'PPAModel.PPA_MATR_PARAMETER','inverseProperty':'PPA_MAT_RECORD' }
  });

  $data.Entity.extend('PPAModel.PPA_MATR_PARAMETER', {
     'PV_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':10 },
     'REC_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'PPA_MAT_RECORD': { 'type':'PPAModel.PPA_MAT_RECORD','required':true,'inverseProperty':'PPA_MATR_PARAMETER' }
  });

  $data.Entity.extend('PPAModel.PPA_OEE_SUMMARY', {
     'SUM_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'SH_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'PER_END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'PL_PRD_TIME': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'ACT_PRD_TIME': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'SCH_DT_TIME': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'UNSCH_DT_TIME': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'UNSCH_DT_CNT': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'IDEAL': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'ACTUAL': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'TOTAL_ITEMS': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'QA_ITEMS': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'REWORK_ITEMS': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'SCRAP_ITEMS': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PPA_AVA': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PPA_PER': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PPA_QUA': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PPA_COM': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'D_UPDATE': { 'type':'Edm.DateTime','nullable':false,'required':true }
  });

  $data.Entity.extend('PPAModel.PPA_PER_DETAIL', {
     'PDTL_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'PRD_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'PPA_PERIOD': { 'type':'PPAModel.PPA_PERIOD','required':true,'inverseProperty':'PPA_PER_DETAIL' }
  });

  $data.Entity.extend('PPAModel.PPA_PER_RECORD', {
     'REC_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'D_RECORD': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'REC_START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'REC_END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'SH_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'BATCH_ID': { 'type':'Edm.String','maxLength':64 },
     'IDEAL': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'ACTUAL': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PROCESSED': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'D_UPDATE': { 'type':'Edm.DateTime' },
     'OPERATOR': { 'type':'Edm.String','maxLength':128 },
     'PPA_PERR_PARAMETER': { 'type':'Array','elementType':'PPAModel.PPA_PERR_PARAMETER','inverseProperty':'PPA_PER_RECORD' }
  });

  $data.Entity.extend('PPAModel.PPA_PERIOD', {
     'PER_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'SH_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'PPA_PER_DETAIL': { 'type':'Array','elementType':'PPAModel.PPA_PER_DETAIL','inverseProperty':'PPA_PERIOD' },
     'PPA_SHIFT': { 'type':'PPAModel.PPA_SHIFT','required':true,'inverseProperty':'PPA_PERIOD' }
  });

  $data.Entity.extend('PPAModel.PPA_PERR_PARAMETER', {
     'PV_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':10 },
     'REC_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'PPA_PER_RECORD': { 'type':'PPAModel.PPA_PER_RECORD','required':true,'inverseProperty':'PPA_PERR_PARAMETER' }
  });

  $data.Entity.extend('PPAModel.PPA_QA_RECORD', {
     'REC_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'EQP_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'D_RECORD': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'REC_START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'REC_END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'SH_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PER_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'BATCH_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'TOTAL': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'QUALIFY': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'REWORK': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'SCRAP': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PROCESSED': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'D_UPDATE': { 'type':'Edm.DateTime' },
     'OPERATOR': { 'type':'Edm.String','maxLength':128 },
     'PPA_QAR_PARAMETER': { 'type':'Array','elementType':'PPAModel.PPA_QAR_PARAMETER','inverseProperty':'PPA_QA_RECORD' }
  });

  $data.Entity.extend('PPAModel.PPA_QAR_PARAMETER', {
     'PV_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':10 },
     'REC_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'PAR_POS': { 'type':'Edm.Int16' },
     'PAR_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':5 },
     'VALUE_TYPE': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':1 },
     'HIGH_VALUE': { 'type':'Edm.String','maxLength':700 },
     'LOW_VALUE': { 'type':'Edm.String','maxLength':700 },
     'RANGE_TYPE': { 'type':'Edm.String','maxLength':2 },
     'PPA_QA_RECORD': { 'type':'PPAModel.PPA_QA_RECORD','required':true,'inverseProperty':'PPA_QAR_PARAMETER' }
  });

  $data.Entity.extend('PPAModel.PPA_SHIFT', {
     'SH_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'SH_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'CALD_NO': { 'type':'Edm.Decimal','nullable':false,'required':true },
     'START_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'END_TIME': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'TEAM_ID': { 'type':'Edm.String','nullable':false,'required':true,'maxLength':64 },
     'PPA_PERIOD': { 'type':'Array','elementType':'PPAModel.PPA_PERIOD','inverseProperty':'PPA_SHIFT' }
  });

  $data.Entity.extend('PPAModel.SYS_USER_SESSION', {
     'SESSION_NO': { 'key':true,'type':'Edm.Decimal','nullable':false,'required':true },
     'TERMINAL_ID': { 'type':'Edm.String','maxLength':64 },
     'USER_ID': { 'type':'Edm.String','maxLength':64 },
     'ROLE_ID': { 'type':'Edm.String','maxLength':64 },
     'SESSION_START_DATE': { 'type':'Edm.DateTime','nullable':false,'required':true },
     'SESSION_END_DATE': { 'type':'Edm.DateTime' }
  });

  $data.EntityContext.extend('AicTech.PPA.DataModel.PPAEntities', {
     'EXT_PP_POS': { type: $data.EntitySet, elementType: PPAModel.EXT_PP_POS},
     'EXT_PRD_PLAN': { type: $data.EntitySet, elementType: PPAModel.EXT_PRD_PLAN},
     'MD_CALCULATION': { type: $data.EntitySet, elementType: PPAModel.MD_CALCULATION},
     'MD_CONFIGURATION': { type: $data.EntitySet, elementType: PPAModel.MD_CONFIGURATION},
     'MD_DOM_VALUE': { type: $data.EntitySet, elementType: PPAModel.MD_DOM_VALUE},
     'MD_DOMAIN': { type: $data.EntitySet, elementType: PPAModel.MD_DOMAIN},
     'MD_DT_CAUSE': { type: $data.EntitySet, elementType: PPAModel.MD_DT_CAUSE},
     'MD_DT_CLASS': { type: $data.EntitySet, elementType: PPAModel.MD_DT_CLASS},
     'MD_PAR_CATEGORY': { type: $data.EntitySet, elementType: PPAModel.MD_PAR_CATEGORY},
     'MD_PAR_CLASSIFICATION': { type: $data.EntitySet, elementType: PPAModel.MD_PAR_CLASSIFICATION},
     'MD_PARAMETER': { type: $data.EntitySet, elementType: PPAModel.MD_PARAMETER},
     'MD_UNITS_OF_MEASURE': { type: $data.EntitySet, elementType: PPAModel.MD_UNITS_OF_MEASURE},
     'PM_CFG_TEMPLATE': { type: $data.EntitySet, elementType: PPAModel.PM_CFG_TEMPLATE},
     'PM_EQP_CALCULATION': { type: $data.EntitySet, elementType: PPAModel.PM_EQP_CALCULATION},
     'PM_EQP_CLASS': { type: $data.EntitySet, elementType: PPAModel.PM_EQP_CLASS},
     'PM_EQP_CLS_PROPERTY': { type: $data.EntitySet, elementType: PPAModel.PM_EQP_CLS_PROPERTY},
     'PM_EQP_PROPERTY': { type: $data.EntitySet, elementType: PPAModel.PM_EQP_PROPERTY},
     'PM_EQUIPMENT': { type: $data.EntitySet, elementType: PPAModel.PM_EQUIPMENT},
     'PM_PER_DETAIL': { type: $data.EntitySet, elementType: PPAModel.PM_PER_DETAIL},
     'PM_PERIOD': { type: $data.EntitySet, elementType: PPAModel.PM_PERIOD},
     'PM_SHIFT': { type: $data.EntitySet, elementType: PPAModel.PM_SHIFT},
     'PM_SHIFT_PATTERN': { type: $data.EntitySet, elementType: PPAModel.PM_SHIFT_PATTERN},
     'PM_SHP_CYCLES': { type: $data.EntitySet, elementType: PPAModel.PM_SHP_CYCLES},
     'PPA_CALENDAR': { type: $data.EntitySet, elementType: PPAModel.PPA_CALENDAR},
     'PPA_DT_RECORD': { type: $data.EntitySet, elementType: PPAModel.PPA_DT_RECORD},
     'PPA_DTR_PARAMETER': { type: $data.EntitySet, elementType: PPAModel.PPA_DTR_PARAMETER},
     'PPA_ENG_RECORD': { type: $data.EntitySet, elementType: PPAModel.PPA_ENG_RECORD},
     'PPA_ENGR_PARAMETER': { type: $data.EntitySet, elementType: PPAModel.PPA_ENGR_PARAMETER},
     'PPA_EQP_CALENDAR': { type: $data.EntitySet, elementType: PPAModel.PPA_EQP_CALENDAR},
     'PPA_MAT_RECORD': { type: $data.EntitySet, elementType: PPAModel.PPA_MAT_RECORD},
     'PPA_MATR_PARAMETER': { type: $data.EntitySet, elementType: PPAModel.PPA_MATR_PARAMETER},
     'PPA_OEE_SUMMARY': { type: $data.EntitySet, elementType: PPAModel.PPA_OEE_SUMMARY},
     'PPA_PER_DETAIL': { type: $data.EntitySet, elementType: PPAModel.PPA_PER_DETAIL},
     'PPA_PER_RECORD': { type: $data.EntitySet, elementType: PPAModel.PPA_PER_RECORD},
     'PPA_PERIOD': { type: $data.EntitySet, elementType: PPAModel.PPA_PERIOD},
     'PPA_PERR_PARAMETER': { type: $data.EntitySet, elementType: PPAModel.PPA_PERR_PARAMETER},
     'PPA_QA_RECORD': { type: $data.EntitySet, elementType: PPAModel.PPA_QA_RECORD},
     'PPA_QAR_PARAMETER': { type: $data.EntitySet, elementType: PPAModel.PPA_QAR_PARAMETER},
     'PPA_SHIFT': { type: $data.EntitySet, elementType: PPAModel.PPA_SHIFT},
     'SYS_USER_SESSION': { type: $data.EntitySet, elementType: PPAModel.SYS_USER_SESSION},
     'GetSequenceNextValue': { type: $data.ServiceOperation, returnType: 'Edm.Decimal', method: 'GET', params: [{ name: 'sequenceName', type: 'Edm.String' }] },
     'GetSequenceNextValues': { type: $data.ServiceOperation, returnType: $data.Queryable, elementType: 'Edm.Decimal', method: 'GET', params: [{ name: 'sequenceName', type: 'Edm.String' }, { name: 'count', type: 'Edm.Int32' }] }
  });

  $data.generatedContexts = $data.generatedContexts || [];
  $data.generatedContexts.push(AicTech.PPA.DataModel.PPAEntities);
  
      
})(window, $data);
      
    