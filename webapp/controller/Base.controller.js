sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.model.json.JSONModel} JSONModel
     */

    function (Controller, JSONModel) {

        return Controller.extend("nryzy.employees.controller.Base", {
            onInit: function () {

            },

            toOrderDetails: function (oEvent) {
                //obtenemos order id que fue oprimido para pasarlo como parámetro
                let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // RouteOrderDetails está definido en los routes del manifest
                oRouter.navTo("RouteOrderDetails", {
                    OrderID: orderID
                })
            }
        });

    });