sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "nryzy/employees/model/formatter"
], function (Controller, formatter) {


    function onInit() {
        console.log("EmployeeDetails onInit");
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
        var oView = this.getView();
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

        }
        
    }

    var EmployeeDetails = Controller.extend("nryzy.employees.controller.EmployeeDetails", {});

    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    // El "F"ormatter es lo que tenemos en la vista
    // El "f"ormatter es lo que tenemos acá
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    
    return EmployeeDetails;

});