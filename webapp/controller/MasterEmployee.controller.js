sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "nryzy/employees/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Base, JSONModel, Filter, FilterOperator) {
        "use strict";

        // Según el cíclo de vida es lo primero que se va a ejecutar en el controlador
        function onInit() {
            console.log("MasterEmployee onInit");
            // Ver si anda o hay que splitear en 2 líneas
            this._bus = sap.ui.getCore().getEventBus();
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
            //var oContext = iconPressed.getBindingContext("jsonEmployees");
            var oContext = iconPressed.getBindingContext("odataNorthwind");

            //hay que chequear si no está creado porque puede hacer click más de una vez
            if(!this._oDialogOrders){
                this._oDialogOrders = sap.ui.xmlfragment("nryzy.employees.fragment.DialogOrders", this);
                var oView = this.getView();
                oView.addDependent(this._oDialogOrders);
            };

            // Dialog Binding al contexto para tener acceso a los datos del ítem seleccionado
            //var bind = "jsonEmployees>" + oContext.getPath();
            var bind = "odataNorthwind>" + oContext.getPath();
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

        function showEmployee(oEvent){
            var itemPressed = oEvent.getSource();
            //var oContext = itemPressed.getBindingContext("jsonEmployees");
            var oContext = itemPressed.getBindingContext("odataNorthwind");
            var path = oContext.getPath();
            // pUBLICAMOS UN EVENTO
            this._bus.publish("flexible", "showEmployee", path);
            
        }

        /*function toOrderDetails(oEvent){
            // Este llamado proviene del TableOrders.fragment
            //obtenemos order id que fue oprimido para pasarlo como parámetro
            let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // RouteOrderDetails está definido en los routes del manifest
            oRouter.navTo("RouteOrderDetails", {
                OrderID : orderID
            })
        }*/

        var Main = Base.extend("nryzy.employees.controller.MasterEmployee", {});
        // Cuando se dispara el onValidate, llama al myCheck
        //onValidate: myCheck
        /*Main.prototype.onValidate = function () {
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
        };*/

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
        //Main.prototype.toOrderDetails = toOrderDetails;
        

        return Main;
    });
