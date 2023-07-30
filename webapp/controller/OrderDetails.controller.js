sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.core.routing.History} History
     */

    function (Controller, JSONModel, History) {
        // Parte privada
        function _onObjectMatched(oEvent){
            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
                model: "odataNorthwind"
            });
        }
         


        // Parte pública --> Lo que exponemos del controlador
        return Controller.extend("nryzy.employees.controller.OrderDetails", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },

            onBack: function(oEvent){
                let oHistory = History.getInstance();
                let sPreviousHash = oHistory.getPreviousHash();

                // si puso la url directo no hay historial previo
                if (sPreviousHash !== undefined) {
                    // para ir a la página anterior
                    window.history.go(-1);
                }else{
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    // como no hay navegación previa, lo pateamos a la vista que tenemos
                    // seteada en el main como default
                    oRouter.navTo("RouteMain", true);
                }
            },

            onClearSignature: function(oEvent){
                let signature = this.byId("signature");
                // Esta es la función clear que implementamos en el Signature.js
                signature.clear();
            }
        });
});