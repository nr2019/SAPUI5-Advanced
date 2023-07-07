sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
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

        function onFilter(){
            var oJSON = this.getView().getModel().getData();
            var filters = [];
            // Sobre el filters armo los filtros que quiero que tenga la tabla
            if (oJSON.EmployeeId !== ""){
                // EmployeeID es un campo del modelo (archivo json que cargo)
                // EmployeeId es el ID que le asigné al inputEmployee en la vista
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }

            if (oJSON.CountryKey !== ""){
                // Country es un campo del modelo (archivo json que cargo)
                // CountryKey es el ID que le asigné al slCountry en la vista
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
            }

            // Luego de armar los filtros que quiero aplicar, se actualiza la tabla de 
            // la vista con los filtros armados
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter(){
            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
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
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;

        return Main;
    });
