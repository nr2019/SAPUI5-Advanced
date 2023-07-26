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

    function onCreateIncidence(){
        var oView = this.getView();
        var tableIncidence = oView.byId("tableIncidence");
        // el this es para vincularlo con la instancia
        var newIncidence = sap.ui.xmlfragment("nryzy.employees.fragment.NewIncidence", this);
        var incidenceModel = oView.getModel("incidenceModel");
        var oData = incidenceModel.getData();
        var index = oData.length;
        oData.push({ index : index + 1}); 
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    }

    function onDeleteIncidence(oEvent){ 
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

        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        // publicamos el evento delete
        this._bus.publish("incidence", "onDeleteIncidence", {
            IncidenceId: contextObj.IncidenceId,
            SapId: contextObj.SapId,
            EmployeeId: contextObj.EmployeeId           
        });
        
    }

    function onSaveIncidence(oEvent){
        var rowIncidenceSource = oEvent.getSource();
        var rowIncidenceParent = rowIncidenceSource.getParent();
        var incidence = rowIncidenceParent.getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        // publicamos el evento incidence de la función onSaveIncidence enviando el objeto incidenceRow
        // como el sPath puede venir con /0 /1 /unnumero, reemplazamos la barra por nada, 
        // ya que solo hay que mandar un número
        this._bus.publish("incidence", "onSaveIncidence", {incidenceRow : incidenceRow.sPath.replace('/', '')});
    }

    function updateIncidenceCreationDate(oEvent){
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.CreationDateX = true;
    }
    
    function updateIncidenceReason(oEvent){
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.ReasonX = true;
    }
    function updateIncidenceType(oEvent){
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.TypeX = true;
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

    return EmployeeDetails;

});