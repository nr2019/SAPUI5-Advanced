sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.core.routing.History} History
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {sap.m.MessageBox} MessageBox
     */

    function (Controller, JSONModel, History, MessageBox, Filter, FilterOperator) {
        // Parte privada
        function _onObjectMatched(oEvent) {
            this.onClearSignature();
            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
                model: "odataNorthwind",
                events: {
                    dataReceived: function (oData) {
                        // si refresca la página el modelo no llega a cargarse, por ende da error
                        // Por ello, la ejecutamos en el detaReceived
                        _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }.bind(this)
                }
            });

            const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders("
                + oEvent.getParameter("arguments").OrderID + ")").getObject();
            if (objContext) {
                // si refresca la página el modelo no llega a cargarse, por ende da error
                _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
            }
        }

        function _readSignature(orderId, employeeId) {
            //Read Signature Image
            let firma = "/SignatureSet(OrderId='" + orderId +
                "',SapId='" + this.getOwnerComponent().SapId +
                "',EmployeeId='" + employeeId + "')";

            this.getView().getModel("incidenceModel").read(firma, {
                success: function (data) {
                    //Obtenemos instancia de firma
                    const signature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }
                    console.log("Firma OK");

                }.bind(this),
                error: function (data) {
                    console.log("Firma Error");
                }
            });

            //Bind Files
            try {
                let oFilter = [];
                oFilter[0] = new sap.ui.model.Filter("OrderId", sap.ui.model.FilterOperator.EQ, orderId);
                oFilter[1] = new sap.ui.model.Filter("SapId", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);
                oFilter[2] = new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, employeeId);

                this.byId("uploadCollection").bindAggregation("items", {
                    path: "incidenceModel>/FilesSet",
                    filters: oFilter,
                    //[
                    /*new sap.ui.model.Filter("OrderId", FilterOperator.EQ, orderId),
                    new sap.ui.model.Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", FilterOperator.EQ, employeeId)*/
                    /*new Filter("OrderId", FilterOperator.EQ, orderId),
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeId)*/
                    //],

                    template: new sap.m.UploadCollectionItem({
                        documentId: "{incidenceModel>AttId}",
                        visibleEdit: false,
                        fileName: "{incidenceModel>FileName}"
                    }).attachPress(this.downloadFile)
                });
            } catch (error) {
                console.log(error)
            }


        }


        // Parte pública --> Lo que exponemos del controlador
        return Controller.extend("nryzy.employees.controller.OrderDetails", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },

            onBack: function (oEvent) {
                let oHistory = History.getInstance();
                let sPreviousHash = oHistory.getPreviousHash();

                // si puso la url directo no hay historial previo
                if (sPreviousHash !== undefined) {
                    // para ir a la página anterior
                    window.history.go(-1);
                } else {
                    let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    // como no hay navegación previa, lo pateamos a la vista que tenemos
                    // seteada en el main como default
                    oRouter.navTo("RouteMain", true);
                }
            },

            onClearSignature: function (oEvent) {
                let signature = this.byId("signature");
                // Esta es la función clear que implementamos en el Signature.js
                signature.clear();
            },

            factoryOrderDetails: function (listId, oContext) {
                let contextObject = oContext.getObject();
                // Acá en contextObject la propiedad currency no existe, pero yo se la puedo
                // agregar
                contextObject.Currency = "EUR";
                let unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");
                if (contextObject.Quantity <= unitsInStock) {
                    let objectListItem = new sap.m.ObjectListItem({
                        title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                        number: "{parts: [ {path:'odataNorthwind>UnitPrice'}, {path:'odataNorthwind>Currency'} ], type: 'sap.ui.model.type.Currency', formatOptions:{showMeasure: false}}",
                        numberUnit: "{path:'odataNorthwind>Currency'}"
                    });
                    return objectListItem;
                } else {
                    let customListItem = new sap.m.CustomListItem({
                        content: [
                            new sap.m.Bar({
                                contentLeft: new sap.m.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})" }),
                                contentMiddle: new sap.m.ObjectStatus({ text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error" }),
                                contentRight: new sap.m.Label({
                                    text: "{parts: [ {path:'odataNorthwind>UnitPrice'}, {path:'odataNorthwind>Currency'} ], type: 'sap.ui.model.type.Currency'}"
                                })
                            })
                        ]
                    })
                    return customListItem;
                }
            },

            onSaveSignature: function (oEvent) {
                //Obtenemos instancia de la firma
                const signature = this.byId("signature");
                const oResourceBoundle = this.getView().getModel("i18n").getResourceBundle();
                let signaturePng;

                if (!signature.isFill()) {
                    MessageBox.error(oResourceBoundle.getText("fillSignature"));
                } else {
                    //obtenemos el formato de la firma en base 64, sin la parte inicial, solo al imagen
                    signaturePng = signature.getSignature().replace("data:image/png;base64,", "");
                    let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                    let body = {
                        OrderId: objectOrder.OrderID.toString(),
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: objectOrder.EmployeeID.toString(),
                        MimeType: "imag/png",
                        MediaContent: signaturePng
                    };

                    this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                        success: function () {
                            MessageBox.information(oResourceBoundle.getText("signatureSaved"));
                        },
                        error: function () {
                            MessageBox.error(oResourceBoundle.getText("signatureNotSaved"));
                        }
                    })
                }
            },

            onFileBeforeUpload: function (oEvent) {
                let fileName = oEvent.getParameter("fileName");
                let objContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: objContext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objContext.EmployeeID + ";" + fileName
                });
                // A todos los parámetros que tiene la instancia, le agregamos el nuevo parámetro que creamos con el slug
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource();
                //Header token CSRF
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("incidenceModel").getSecurityToken()
                });

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },

            onFileDeleted: function (oEvent) {
                let oUploadCollection = oEvent.getSource();
                let sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
                this.getView().getModel("incidenceModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },
                    error: function () {
                        //error
                    }
                });
            },
            downloadFile: function(oEvent){
                const sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
                window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
            }
        });
    }); 