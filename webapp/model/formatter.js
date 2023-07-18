sap.ui.define([], function () {
    function dateFormat(date) {
        // 24 horas * 60 minutos * 60 segundos * 1000 milisegundos; < --Timeday de un día  
        var timeDay = 24 * 60 * 60 * 1000;
        if (date) {
            var dateNow = new Date();
            //yyyy/MM/dd
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" });
            var dateNowFormat = new Date(dateFormat.format(dateNow));
            var oView = this.getView();
            var oModelI18n = oView.getModel("i18n");
            var getResourceBundle  = oModelI18n.getResourceBundle();

            switch (true) {
                case date.getTime() === dateNowFormat.getTime():
                    return getResourceBundle .getText("today");
                case date.getTime() === dateNowFormat.getTime() + timeDay:
                    return getResourceBundle .getText("tomorrow");
                case date.getTime() === dateNowFormat.getTime() - timeDay:
                    return getResourceBundle .getText("yesterday");
                default:
                    return "";
            }
        }


    }

    return {
        dateFormat: dateFormat
    }
})