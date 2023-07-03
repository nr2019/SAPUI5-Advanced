sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        function onInit() {

            let oView = this.getView(),
                i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),
                oJSONModel = new JSONModel();
            
            oJSONModel.loadData("../localService/mockdata/Employees.json");
            oJSONModel.attachParseError(function(oEvent) { console.log(oEvent); });
            // Obtengo la vista
            
            //se vincula el modelo a la vista
            oView.setModel(oJSONModel);
        }


        var Main = Controller.extend("nryzy.employees.controller.MainView", {});
        // Cuando se dispara el onValidate, llama al myCheck
        //onValidate: myCheck
        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                // inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);

            } else {
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        };

        Main.prototype.onInit = onInit;

        return Main;
    });
