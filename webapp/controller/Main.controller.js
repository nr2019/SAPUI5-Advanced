sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.model.json.JSONModel} JSONModel
    * @param {typeof sap.ui.model.Filter} Filter
    * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */

    function (Controller, JSONModel, Filter, FilterOperator) {

        return Controller.extend("nryzy.employees.controller.Main", {

            onBeforeRendering: function () {
                var oView = this.getView();
                this._detailEmployeeView = oView.byId("detailEmployeeView");
            },

            onInit: function () {
                console.log("MainController onInit");
                let oView = this.getView(),
                    oJSONModel = new JSONModel();

                oJSONModel.loadData("../localService/mockdata/Employees.json");

                // Obtengo la vista

                //se vincula el modelo a la vista
                oView.setModel(oJSONModel, "jsonEmployees");


                let oJSONCountries = new JSONModel();
                oJSONCountries.loadData("../localService/mockdata/Countries.json");
                oView.setModel(oJSONCountries, "jsonCountries");

                let oJSONLayout = new JSONModel();
                oJSONLayout.loadData("../localService/mockdata/Layout.json");
                oView.setModel(oJSONLayout, "jsonLayout");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    // uno por columna
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonConfig");

                this._bus = sap.ui.getCore().getEventBus();
                // Se suscribe al evento que se dispara en masterEmployee y lo resuelve con showEmployeeDetails
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
                // Se suscribe al evento que se dispara el save del odata
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

            },

            showEmployeeDetails: function (category, nameEvent, path) {
                // obtenemos la instancia de la vista llamada en Main.View.xml
                var oView = this.getView();
                var detailView = oView.byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);

                var modelLayout = oView.getModel("jsonLayout");
                // el activeKey es el valor actual del combo box. Si lo cambiamos, cambia el layout
                modelLayout.setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                // para que cuando cambiemos de ítem no arrastre los valores anteriores
                detailView.byId("tableIncidence").removeAllContent();
            },

            onSaveODataIncidence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                //var incidenceV = ;
                let incidenceM = this._detailEmployeeView.getModel("incidenceModel");
                var incidenceModel = incidenceM.getData();

                if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                    // Cuerpo de la llamada del servicio odata
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason
                    }
                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOk"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    })
                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                }
            }
        });
    });