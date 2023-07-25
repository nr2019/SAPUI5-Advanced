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

                this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
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
                            // se actualiza el nro de incidente. como es asíncrona se utiliza el bind(this)
                            this.onReadODataIncidence.bind(this)(employeeId);
                            // mensaje OK
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOk"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    })
                } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                    incidenceModel[data.incidenceRow].ReasonX ||
                    incidenceModel[data.incidenceRow].TypeX) {
                    var body = {
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                        Type: incidenceModel[data.incidenceRow].Type,
                        TypeX: incidenceModel[data.incidenceRow].TypeX,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        ReasonX: incidenceModel[data.incidenceRow].ReasonX
                    };
                    this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                        "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                        "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                        success: function () {
                            // se actualiza el nro de incidente. como es asíncrona se utiliza el bind(this)
                            this.onReadODataIncidence.bind(this)(employeeId);
                            // mensaje OK
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOk"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                        }.bind(this)
                    });


                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                }
            },

            onReadODataIncidence: function (emlployeeID) {
                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", emlployeeID.toString())
                    ],
                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        //Actualizamos los datos en pantalla
                        incidenceModel.setData(data.results);
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        //Siempre borramos por si hace click varias veces
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            // Acá hay que tener cuidado. si lo hago con "this" va a tomar como controlador el Main
                            // con lo que no tenemos las funciones creadas para adeministrar los botones.
                            // estas funciones están en EmployeeFetails.controller
                            // por ello, toma el controlador de _detailEmpl...
                            var newIncidence = sap.ui.xmlfragment("nryzy.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),
                    error: function (e) {

                    }
                })
            }
        });
    });