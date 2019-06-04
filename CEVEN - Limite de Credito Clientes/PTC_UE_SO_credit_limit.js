/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 *
 * Module Description
 *
 * Version    Date            Author           				Remarks
 * 1.00       29 Mar 2019     Preteco: Leonardo Nieto		Update customer credit limit
 *
 */

define(['N/record','N/currency','N/search','N/format','N/ui/dialog'],

function(record,currency,search,format,dialog) {

    /**
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     */

    function beforeLoad(context) {

		if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT || context.type === context.UserEventType.DETELE || context.type === context.UserEventType.CANCEL || context.type === context.UserEventType.COPY)
          {
			  var rate = 1;
              var currentRecord = context.newRecord;

              var entityIdi = currentRecord.getValue("entity");
              
              if (entityIdi == 1605){
            	  return true;
              }
              
              var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: entityIdi,
                isDynamic: false,
                defaultValues: null
              });

   /*           if (customerRecord.getValue({fieldId: "currency"}) === '5')
              {
                  rate = currency.exchangeRate({
                    source: 'USD',
                    target: 'ARS',
                    date: new Date()
                    });
              }
            
              var usdAmount = rate;*/
              
              rate = currency.exchangeRate({
                  source: 'USD',
                  target: 'ARS',
                  date: new Date()
                	});
              
              var usdAmount = rate;
              
              if (customerRecord.getValue({fieldId: "currency"}) == '1')
              {
            	  var usdAmount = 1;            
              }

              var custBalance = customerRecord.getValue({
                fieldId: "balance"});

              var custUnbilledorders = customerRecord.getValue({
                fieldId: "unbilledorders"});

              var custSeguro = customerRecord.getValue({
                fieldId: "custentity_seguro"});

              var custFianza = customerRecord.getValue({
                fieldId: "custentity_fianza"});

              var custCreditoP = customerRecord.getValue({
                fieldId: "custentity_creditopropio"});

              var custSaldoVenc = customerRecord.getValue({
                fieldId: "overduebalance"});

              var arsAmont = (custSeguro + custFianza + custCreditoP) * usdAmount ;

              var d = new Date();
              d.setDate(d.getDate() + 2)

              var DateString = format.format({
                value: d,
                type: format.Type.DATE
              });

              var mySearch = search.create({
                type: 'customrecord_l54_cheques_en_cartera',
                filters: [
                  [['custrecord_cheque_cliente',search.Operator.ANYOF,[entityIdi]],
                   'AND',
                   ['custrecord_cheque_estado',search.Operator.ANYOF,[1,4,9,10,11]]],
                  'OR',
                  [['custrecord_cheque_cliente',search.Operator.ANYOF,[entityIdi]],
                   'AND',
                   ['custrecord_cheque_estado',search.Operator.ANYOF,[2]],
                   'AND',
                   ['custrecord_cheque_fecha_de_vto',search.Operator.AFTER,[DateString]]]
                ],
                columns: [{
                  name: 'custrecord_cheque_importe',
                  summary: search.Summary.SUM
                }]
              });

              var resultset = mySearch.run();
              var results = resultset.getRange(0, 1000);
              var amountTotal = 0;
              for(var i in results){
                var result = results[i];
                for(var k in result.columns){
                  amountTotal = result.getValue(result.columns[k]);
                }
              }

              if (amountTotal.length === 0)
                amountTotal = 0;

              var creditAvailable = 0;
              
              if (customerRecord.getValue({fieldId: "currency"}) == '1')
              {
            	  amountTotal = amountTotal / rate;
              }
              
              
              if (arsAmont !== 0)
                creditAvailable = ((arsAmont - custBalance) - custUnbilledorders) - amountTotal;
              else
                creditAvailable = custBalance - custUnbilledorders - amountTotal;

              currentRecord.setValue({
                fieldId: 'custbody_limite_credito',
                value: arsAmont
              });

              currentRecord.setValue({
                fieldId: 'custbody_credito_disponible',
                value: parseFloat(creditAvailable).toFixed(2)
              });

              currentRecord.setValue({
                fieldId: 'custbody_saldo',
                value: custBalance
              });

              currentRecord.setValue({
                fieldId: 'custbody_saldo_vencido',
                value: custSaldoVenc
              });

              currentRecord.setValue({
                fieldId: 'custbody_pedido_no_facturado',
                value: custUnbilledorders
              });

              currentRecord.setValue({
                fieldId: 'custbody_cheques_acreditar',
                value: amountTotal
              });

              customerRecord.setValue({
                fieldId: 'custentity_cheques_por_acreditar',
                value: amountTotal
              });

              customerRecord.setValue({
                fieldId: 'custentity_credito_disponible',
                value: parseFloat(creditAvailable).toFixed(2)
              });

	        try {
	        	customerRecord.save();
	        }
    		catch (e) {
                log.error({
                  title: e.name,
                  details: ' Client: ' + customerRecord.id + ' - ' + e.message
                });
              }
          }
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */

    function afterSubmit(context) {
        var currentRecord = context.newRecord;
        var entityIdi = currentRecord.getValue("entity");
		var rate = 1;
      
        var customerRecord = record.load({
          type: record.Type.CUSTOMER,
          id: entityIdi,
          isDynamic: false,
          defaultValues: null
        });

        if (customerRecord.getValue({fieldId: "currency"}) === '5')
        {
          rate = currency.exchangeRate({
            source: 'USD',
            target: 'ARS',
            date: new Date()
          });
        }

        var usdAmount = rate;

        var custBalance = customerRecord.getValue({
          fieldId: "balance"});

        var custUnbilledorders = customerRecord.getValue({
          fieldId: "unbilledorders"});

        var custSeguro = customerRecord.getValue({
          fieldId: "custentity_seguro"});

        var custFianza = customerRecord.getValue({
          fieldId: "custentity_fianza"});

        var custCreditoP = customerRecord.getValue({
          fieldId: "custentity_creditopropio"});

        var arsAmont = (custSeguro + custFianza + custCreditoP) * usdAmount ;

        var d = new Date();
        d.setDate(d.getDate() + 2)

        var DateString = format.format({
          value: d,
          type: format.Type.DATE
        });

        var mySearch = search.create({
          type: 'customrecord_l54_cheques_en_cartera',
          filters: [
            [['custrecord_cheque_cliente',search.Operator.ANYOF,[entityIdi]],
             'AND',
             ['custrecord_cheque_estado',search.Operator.ANYOF,[1,4,9,10,11]]],
            'OR',
            [['custrecord_cheque_cliente',search.Operator.ANYOF,[entityIdi]],
             'AND',
             ['custrecord_cheque_estado',search.Operator.ANYOF,[2]],
             'AND',
             ['custrecord_cheque_fecha_de_vto',search.Operator.AFTER,[DateString]]]
          ],
          columns: [{
            name: 'custrecord_cheque_importe',
            summary: search.Summary.SUM
          }]
        });

        var resultset = mySearch.run();
        var results = resultset.getRange(0, 1000);
        var amountTotal = 0;

        for(var i in results){
          var result = results[i];
          for(var k in result.columns){
            amountTotal = result.getValue(result.columns[k]);
          }
        }

        if (amountTotal.length === 0)
          amountTotal = 0;

        var custCredito = customerRecord.getValue({
          fieldId: "custentity_credito_disponible"});

        var custTotal = currentRecord.getValue({
          fieldId: "total"});

        var creditAvailable = (((arsAmont - custBalance) - custUnbilledorders) - amountTotal) ;

        customerRecord.setValue({
          fieldId: 'custentity_cheques_por_acreditar',
          value: amountTotal
        });

        customerRecord.setValue({
          fieldId: 'custentity_credito_disponible',
          value: parseFloat(creditAvailable).toFixed(2)
        });

        customerRecord.save();

        if (custCredito <= custTotal)
        {
          dialog.alert({
            title: "Línea de crédito del cliente",
            message: "El total de la orden de venta: " + custTotal.toString() + ", excede al saldo de la línea crédito disponible del cliente: " + custCredito.toString()
          });
        };
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };

});