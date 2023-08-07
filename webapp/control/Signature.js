sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/model/json/JSONModel",
],
    /**
     * 
     * @param {sap.ui.core.Control} Control 
     * @param {sap.ui.model.json.JSONModel} JSONModel
     */

    function (Control, JSONModel) {

        return Control.extend("nryzy.employees.control.Signature", {
            metadata: {
                properties: {
                    "width": {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "400px"

                    },

                    "height": {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "100px"

                    },

                    "bgcolor": {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "white"
                    }

                }
            },

            onInit: function () {

            },

            // oRM = Render Manager
            renderer: function (oRM, oControl) {
                // Escribimos en la interfaz de usuario
                oRM.write("<div");
                oRM.addStyle("width", oControl.getProperty("width"));
                oRM.addStyle("height", oControl.getProperty("height"));
                oRM.addStyle("background-color", oControl.getProperty("bgcolor"));
                oRM.addStyle("border", "1px solid black");
                oRM.writeStyles();
                oRM.write(">");
                oRM.write("<canvas width='" + oControl.getProperty("width") + "' " +
                    "height='" + oControl.getProperty("height") + "' ");
                oRM.write("></canvas>");
                oRM.write("</div>");


            },

            onAfterRendering: function () {
                let canvas = document.querySelector("canvas");
                try {
                    this.signaturePad = new SignaturePad(canvas);
                    // mousedown => indica cuando "levanó el lápiz" y dejó de firmar
                    this.signaturePad.fill = false;
                    canvas.addEventListener("mousedown", function(){
                        this.signaturePad.fill = true;
                    }.bind(this));

                } catch (e) {
                    console.error(e);
                }
            },
            
            clear: function(){
                this.signaturePad.clear();
                // Limpiamos, debido a que ya no hay firma dentro del canvas
                this.signaturePad.fill = false;
            },

            isFill : function(){
                return this.signaturePad.fill;
            },

            getSignature: function(){
                // toDataUrl está en la librería signature y nos devuelve la imagen en
                // "algún formato que todavía no sé"
                return this.signaturePad.toDataURL();
            },

            setSignature: function(signature){
                this.signaturePad.fromDataURL(signature);
            }
        });
    });