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
        },

        showEmployeeDetails: function(category, nameEvent, path){
            // obtenemos la instancia de la vista llamada en Main.View.xml
            var oView = this.getView();
            var detailView = oView.byId("detailEmployeeView");
            detailView.bindElement("jsonEmployees>" + path);
            
            var modelLayout = oView.getModel("jsonLayout");
            // el activeKey es el valor actual del combo box. Si lo cambiamos, cambia el layout
            modelLayout.setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, "incidenceModel");
            // para que cuando cambiemos de ítem no arrastre los valores anteriores
            detailView.byId("tableIncidence").removeAllContent();
        }
    });
});