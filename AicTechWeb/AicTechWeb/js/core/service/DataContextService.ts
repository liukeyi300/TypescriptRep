module AicTech.Web.Core.Service {
    export class DataContextService<T extends $data.EntityContext> {
        private static serviceContext;

        public getServiceContext(): T {
            return DataContextService.serviceContext;
        }

        public setServiceContext(context: T) {
            DataContextService.serviceContext = context;
        }
    }
}