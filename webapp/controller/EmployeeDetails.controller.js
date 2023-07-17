sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    return Controller.extend("nryzy.employees.controller.EmployeeDetails", {
        onInit: function () {
            console.log("EmployeeDetails onInit");
        },
    });
});