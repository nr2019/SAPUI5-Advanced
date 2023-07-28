sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "nryzy/employees/model/formatter"
], function (Controller, formatter) {


    function onInit() {
        console.log("EmployeeDetails onInit");
        this._bus = sap.ui.getCore().getEventBus();
        // Se suscribe al evento que se dispara en masterEmployee y lo resuelve con showEmployeeDetails
        //this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
    };

    function onCreateIncidence() {
        var oView = this.getView();
        var tableIncidence = oView.byId("tableIncidence");
        // el this es para vincularlo con la instancia
        var newIncidence = sap.ui.xmlfragment("nryzy.employees.fragment.NewIncidence", this);
        var incidenceModel = oView.getModel("incidenceModel");
        var oData = incidenceModel.getData();
        var index = oData.length;
        oData.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    }

    function onDeleteIncidence(oEvent) {
        /*var oView = this.getView();
        var tableIncidence = oView.byId("tableIncidence");
        var rowIncidenceSource = oEvent.getSource();
        var rowIncidenceParent = rowIncidenceSource.getParent();
        var rowIncidence = rowIncidenceParent.getParent();
        var incidenceModel = oView.getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var contextObej = rowIncidence.getBindingContext("incidenceModel");

        // los arrays empiezan con cero, por eso el -1
        // desde esa posición se procede a borrar 1
        odata.splice(contextObej.index-1, 1);
        for (var i in odata){
            odata[i].index = parseInt(i) + 1;
        }

        incidenceModel.refresh();
        tableIncidence.removeContent(rowIncidence);

        for (var j in tableIncidence.getContent()){
            tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);

        }*/
        let modelI18n = this.getView().getModel("i18n").getResourceBundle();
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();


        sap.m.MessageBox.confirm(modelI18n.getText("confirmDeleteIncidence"), {
            //Si confirma se ejecuta esta lógica
            onClose: function (oAction) {
                if (oAction === "OK") {
                    // publicamos el evento delete
                    this._bus.publish("incidence", "onDeleteIncidence", {
                        IncidenceId: contextObj.IncidenceId,
                        SapId: contextObj.SapId,
                        EmployeeId: contextObj.EmployeeId
                    })
                }
            }.bind(this)
        })
    }

    function onSaveIncidence(oEvent) {
        var rowIncidenceSource = oEvent.getSource();
        var rowIncidenceParent = rowIncidenceSource.getParent();
        var incidence = rowIncidenceParent.getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        // publicamos el evento incidence de la función onSaveIncidence enviando el objeto incidenceRow
        // como el sPath puede venir con /0 /1 /unnumero, reemplazamos la barra por nada, 
        // ya que solo hay que mandar un número
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
    }

    function updateIncidenceCreationDate(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        // Hay que tener en cuenta que el DatePicker si le ingresas un valor no valido
        // no actualiza su contenido y se queda con el último válido, lo cual no nos sirve
        // Si yo al getSource le hago un getValue(), si trae el valor inválido
        if (!oEvent.getSource().isValidValue()) {
            contextObj._ValidateDate = false;
            contextObj.CreationDateState = "Error";
            sap.m.MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: sap.m.MessageBox.Action.Close,
                emphasizedAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            });
        } else {
            contextObj.CreationDateX = true;

            contextObj._ValidateDate = true;
            contextObj.CreationDateState = "None";
        };

        // Si ingresó fecha y motivo
        if (oEvent.getSource().isValidValue() && contextObj.Reason) {
            contextObj.EnabledSave = true;
        } else {
            contextObj.EnabledSave = false;
        }

        context.getModel().refresh();
    }

    function updateIncidenceReason(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if (oEvent.getSource().getValue()) {
            contextObj.ReasonX = true;
            contextObj.ReasonState = "None";
        } else {
            contextObj.ReasonState = "Error";
        }

        // Si ingresó fecha y motivo
        if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
            contextObj.EnabledSave = true;
        } else {
            contextObj.EnabledSave = false;
        }
        context.getModel().refresh();
    }
    function updateIncidenceType(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if (contextObj._ValidateDate && contextObj.Reason) {
            contextObj.EnabledSave = true;
        } else {
            contextObj.EnabledSave = false;
        }

        contextObj.TypeX = true;
        context.getModel().refresh();
    }

    function toOrderDetails(oEvent){
        //obtenemos order id que fue oprimido para pasarlo como parámetro
        let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
        let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // RouteOrderDetails está definido en los routes del manifest
        oRouter.navTo("RouteOrderDetails", {
            OrderID : orderID
        })
    }
    var EmployeeDetails = Controller.extend("nryzy.employees.controller.EmployeeDetails", {});

    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    // El "F"ormatter es lo que tenemos en la vista
    // El "f"ormatter es lo que tenemos acá
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
    EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
    EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;
    EmployeeDetails.prototype.toOrderDetails = toOrderDetails;
    return EmployeeDetails;

});