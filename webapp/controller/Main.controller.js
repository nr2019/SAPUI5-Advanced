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

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                // uno por columna
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonConfig")
        },
    });
});