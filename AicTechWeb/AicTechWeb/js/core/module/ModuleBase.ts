module AicTech.Web.Core.Module {
    export class ModuleBase implements IDispose {
        protected viewModel: kendo.data.ObservableObject;
        protected startTime: Date;
        protected endTime: Date;
        protected equipId: string;
        protected equipName: string;

        protected get serviceContext(): AicTech.PPA.DataModel.PPAEntities {
            return (new Service.DataContextService<AicTech.PPA.DataModel.PPAEntities>()).getServiceContext();
        }

        public view: JQuery;
        public needEquiptree = true;

        
         constructor() { }

        /**
         * ModuleBase.refreshData()
         * get startTime and endTime and equipmentId
         */
         public refreshData() {
             this.startTime = AicTech.Web.Html.StartUp.Instance.startTime || Utils.DateUtils.lastDay(new Date());
             this.endTime = AicTech.Web.Html.StartUp.Instance.endTime || new Date();
             this.equipId = AicTech.Web.Html.StartUp.Instance.currentEquipmentId;
             this.equipName = AicTech.Web.Html.StartUp.Instance.currentEquipmentName;
         }

         public init(view: JQuery) {
             this.view = view;
         }

         public update() { }

         public dispose() {
             this.startTime = null;
             this.endTime = null;
             this.equipId = "";
             this.equipName = "";
         }
     }
}