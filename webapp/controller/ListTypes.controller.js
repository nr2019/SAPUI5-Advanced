sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("nryzy.lists.controller.ListTypes", {
            onInit: function () {
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.loadData("./localService/mockdata/ListData.json");
                this.getView().setModel(oJSONModel);
            },

            getGroupHeader: function(oGroup){
                var groupHeaderListItem = new sap.m.GroupHeaderListItem({
                    title : oGroup.key,
                    upperCase : true
                });
                return groupHeaderListItem;
            },
            onShowSelectedRow: function(){
                // Si hago el byId todo en una línea, no me lo toma.
                //var standardList = this.getView().byId("standardList");
                // Obtenemos la vista
                var oView = this.getView();
                // Obtenemos la lista de la vista
                var standardList = oView.byId("standardList");
                // Obtenemos los ítems seleccionados de la lista
                var selectedItems = standardList.getSelectedItems();
                // cargamos el modelo i18n
                var i18nModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0){
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                } else{
                    // recorremos los ítems seleccionados
                    var textMessage = i18nModel.getText("selection")
                    for( var item in selectedItems){
                        var context = selectedItems[item].getBindingContext();
                        var oContext = context.getObject();
                        textMessage = textMessage + " " + oContext.Material;

                    }
                    sap.m.MessageToast.show(textMessage);
                }
            },

            onDeleteSelectedRows : function(){
                 // Obtenemos la vista
                 var oView = this.getView();
                 // Obtenemos la lista de la vista
                 var standardList = oView.byId("standardList");
                 // Obtenemos los ítems seleccionados de la lista
                 var selectedItems = standardList.getSelectedItems();
                 // cargamos el modelo i18n
                 var i18nModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                
                 if (selectedItems.length === 0){
                     sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                 } else{
                     // recorremos los ítems seleccionados
                     var textMessage = i18nModel.getText("selection")
                    // no le paso nombre, porque quiero que traiga el defautl
                     var model = oView.getModel();
                     var products = model.getProperty("/Products");
                     //para guardar todos los ítems eliminados
                     var arrayId = [];

                     for (var i in selectedItems){
                        var context = selectedItems[i].getBindingContext();
                        var oContext = context.getObject();
                        // agrega los ids
                        arrayId.push(oContext.Id);
                        textMessage = textMessage + " " + oContext.Material;
                     }
                     products = products.filter(function(p){
                        // dame todos los productos que no se han seleccionado
                        return !arrayId.includes(p.Id);
                     });

                     model.setProperty("/Products", products);
                     standardList.removeSelections();
                     sap.m.MessageToast.show(textMessage);
                 }
            },

            onDeleteRow : function(oEvent){
                var selecterRow = oEvent.getParameter("listItem");
                var context = selecterRow.getBindingContext();
                var splitPath = context.getPath().split("/");
                // el length - 1 me da la última posición
                var indexSelectedRow = splitPath[splitPath.length - 1];
                // Obtenemos la vista
                var oView = this.getView();
                var model = oView.getModel();
                var products = model.getProperty("/Products");
                // elimina desde indexSelectedRow 1 posición
                products.splice(indexSelectedRow, 1);
                // Actualiza el modelo en la interfaz de usuario
                model.refresh();
            }
        });
    });
