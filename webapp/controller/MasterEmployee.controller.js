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

        // Según el cíclo de vida es lo primero que se va a ejecutar en el controlador
        function onInit() {
            console.log("MasterEmployee onInit");
        }

        function onFilter(){
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];
            // Sobre el filters armo los filtros que quiero que tenga la tabla
            if (oJSONCountries.EmployeeId !== ""){
                // EmployeeID es un campo del modelo (archivo json que cargo)
                // EmployeeId es el ID que le asigné al inputEmployee en la vista
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }

            if (oJSONCountries.CountryKey !== ""){
                // Country es un campo del modelo (archivo json que cargo)
                // CountryKey es el ID que le asigné al slCountry en la vista
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }

            // Luego de armar los filtros que quiero aplicar, se actualiza la tabla de 
            // la vista con los filtros armados
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter(){
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        }

        function showPostalCode(oEvent){
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            // dentro del  objectContext voy a tener todas las propiedades del modelo json
            sap.m.MessageToast.show(objectContext.PostalCode);

        }

        function showOrders(oEvent){
            // obtener el controller seleccionado
            var iconPressed = oEvent.getSource();
            // contexto desde el modelo
            var oContext = iconPressed.getBindingContext("jsonEmployees");

            //hay que chequear si no está creado porque puede hacer click más de una vez
            if(!this._oDialogOrders){
                this._oDialogOrders = sap.ui.xmlfragment("nryzy.employees.fragment.DialogOrders", this);
                var oView = this.getView();
                oView.addDependent(this._oDialogOrders);
            };

            // Dialog Binding al contexto para tener acceso a los datos del ítem seleccionado
            var bind = "jsonEmployees>" + oContext.getPath();
            this._oDialogOrders.bindElement(bind);
            this._oDialogOrders.open();
        };

        function onCloseOrders(){
            // Siempre va a existir la instancia, porque solo aparece el botón de cerrar
            // cuando se muestra el diálogo
            this._oDialogOrders.close();  
        };

        function onShowCity(){
            var oView = this.getView();
            var oJSONModelConfig = oView.getModel("jsonConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

        }

        function onHideCity(){
            var oView = this.getView();
            var oJSONModelConfig = oView.getModel("jsonConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }
        var Main = Controller.extend("nryzy.employees.controller.MasterEmployee", {});
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
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;

        return Main;
    });
