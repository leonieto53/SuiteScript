/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
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

    function fieldChanged(context) {
    	var currentRecord = context.currentRecord;
		var FieldName = context.fieldId;
        var rate = 1;

		if (FieldName === 'entity')
		{

          var entityIdi = currentRecord.getValue({
            fieldId: "entity"});

          var customerRecord = record.load({
            type: record.Type.CUSTOMER,
            id: entityIdi,
            isDynamic: false,
            defaultValues: null
          });
          
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
          
          if (customerRecord.getValue({fieldId: "currency"}) == '1')
          {
        	  amountTotal = amountTotal / rate;
          }

          var creditAvailable = 0;
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
            value: creditAvailable
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

          var id = record.submitFields({
            type: record.Type.CUSTOMER,
            id: entityIdi,
            values: {
              creditlimit: arsAmont,
              custentity_cheques_por_acreditar: amountTotal,
              custentity_credito_disponible: creditAvailable
            },
            options: {
              enableSourcing: false,
              ignoreMandatoryFields : true
            } });
		}
    }
  
  function validateField(context){
    	var currentRecord = context.currentRecord;
  		var FieldName = context.fieldId;

		if (FieldName === 'entity'){
          var entityIdi = currentRecord.getValue({
           fieldId: "entity"})
          if (entityIdi === "")
            {
            	alert('Seleccione un Cliente:Trabajo para continuar.')
              	return false;
            }
        }

    return true;
  }

    return {

        fieldChanged: fieldChanged,
        validateField: validateField

    };

});