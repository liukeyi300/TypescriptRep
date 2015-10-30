var OEEDemos;
(function (OEEDemos) {
    var AuthConfiguration = (function () {
        function AuthConfiguration() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.viewModel = kendo.observable({});
        }
        AuthConfiguration.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
        };
        AuthConfiguration.prototype.update = function () {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
        };
        AuthConfiguration.prototype.destory = function () {
            kendo.unbind(this.view);
        };
        return AuthConfiguration;
    })();
    OEEDemos.AuthConfiguration = AuthConfiguration;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=AuthConfiguration.js.map