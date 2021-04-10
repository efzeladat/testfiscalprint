odoo.define('fiscal_print.ReceiptScreenFiscal', function (require) {
    "use strict";

    const { xml } = owl.tags;
    const ReceiptScreen = require('point_of_sale.ReceiptScreen');
    const Registries = require('point_of_sale.Registries');

    const ReceiptScreenFiscal = ReceiptScreen =>
        class extends ReceiptScreen {
            printReceipt2() {
                var self = this;
                var receiptString = this.orderReceipt.comp.el.outerHTML;
                this.download("hola.xml", receiptString);
                // self.showPopup('ErrorPopup', { body: 'No previous orders found' });
            }
            
            download(filename, text) {

                var filename = "descarga.xml"
                // var text = "<hola>plop</hola>"
                var text = this.xmlToPrint();
                var element = document.createElement('a');
                element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }
           xmlToPrint() {
            const order = this.env.pos.get_order();
            const lines = order.orderlines.models;
            const payment = order.paymentlines.models;
               var header = '<BOM>' +
                 '<BO>' +
                   '<AdmInfo>' +
                     '<Object>13</Object>' +
                     '<Version>2</Version>' +
                   '</AdmInfo>' +
                   '<Documents>' +
                     '<row>' +
                       '<DocEntry>' + order.uid.toString() + '</DocEntry>' +
                       '<DocNum>' + order.uid.toString() + '</DocNum>' +
                       '<DocType>Factura</DocType>' +
                       '<DocDate>' + order.validation_date + '</DocDate>' +
                       '<DocDueDate>' + order.date_order + '</DocDueDate>' +
                       '<Address>' + (order.attributes.client.address) ? order.attributes.client.address : '' + '</Address>' +
                       '<DocTotal>' + payment.amount.toString() + '</DocTotal>' +
                       '<DocCurrency></DocCurrency>' +
                       '<DocRate></DocRate>' +
                       '<Reference1></Reference1>' +
                       '<JournalMemo>Punto de Ventas</JournalMemo>' +
                       '<DocTime>' + order.validation_date + '</DocTime>' +
                       '<SalesPersonCode>' + order.pos.employee.name + '</SalesPersonCode>' +
                       '<TaxDate>' + order.validation_date + '</TaxDate>' +
                       '<FederalTaxID></FederalTaxID>' +
                       '<DocTotalFc>' + payment.amount.toString() + '</DocTotalFc>' +
                       '<Address2>' + (order.attributes.client.address) ? order.attributes.client.address : '' + '</Address2>' +
                     '</row>' +
                   '</Documents>';
               var linesFile = '<Document_Lines>';
               for(var i=0;i < lines.length; i++) {
                   var line = lines[i];
                   var lineTemp = '<row><LineNum>';
                       lineTemp += (line.id) ? line.id.toString() : '';
                       lineTemp += '</LineNum><Quantity>';
                       lineTemp += (line.quantity) ? line.quantity.toString() : '';
                       lineTemp += '</Quantity><Price>';
                       lineTemp += (line.price) ? line.price.toString() : '';
                       lineTemp += '</Price><PriceAfterVAT>';
                       lineTemp += (line.price) ? line.price.toString() : '';
                       lineTemp += '</PriceAfterVAT><Currency></Currency><Rate></Rate><DiscountPercent>';
                       lineTemp += (line.discount) ? line.discount.toString() : '';
                       lineTemp += '</DiscountPercent><SalesPersonCode>';
                       lineTemp += (order.pos.employee.name) ? order.pos.employee.name.toString() : '';
                       lineTemp += '</SalesPersonCode><Address>';
                       lineTemp += (line.display_name) ? line.display_name.toString() : '';
                       lineTemp += '</Address><TaxCode></TaxCode><LineTotal>';
                       lineTemp += (line.price) ? line.price.toString() : '';
                       lineTemp += '</LineTotal><TaxPercentagePerRow></TaxPercentagePerRow><TaxTotal>';
                       lineTemp += (line.price) ? line.price.toString() : '';
                       lineTemp += '</TaxTotal><UnitPrice>';
                       lineTemp += (line.price) ? line.price.toString() : '';
                       lineTemp += '</UnitPrice><DocEntry>';
                       lineTemp += (order.uid) ? order.uid.toString() : '';
                       lineTemp += '</DocEntry></row>';
                       linesFile += lineTemp;
                   }
                    linesFile += '</Document_Lines>';

                   var tax = '<LineTaxJurisdictions>' +
                     '<row>' +
                       '<JurisdictionCode>' + order.uid.toString() + '</JurisdictionCode>' +
                       '<JurisdictionType>1</JurisdictionType>' +
                       '<TaxAmount>' + payment.amount.toString() + '</TaxAmount>' +
                       '<DocEntry>' + order.uid.toString() + '</DocEntry>' +
                       '<LineNumber>' + lines.length.toString() + '</LineNumber>' +
                     '</row>' +
                   '</LineTaxJurisdictions>' +
                 '</BO>' +
               '</BOM>';
               return header + linesFile + tax;
            }
        };

    Registries.Component.extend(ReceiptScreen, ReceiptScreenFiscal);

});
