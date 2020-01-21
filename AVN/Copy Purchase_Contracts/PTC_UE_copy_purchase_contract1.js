/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Oct 2019     Preteco
 *
 */


function userEventBeforeLoad(type, form, request){
	try {
		if (type == 'view') {
			
			var recId = nlapiGetRecordId();
			var recType = nlapiGetRecordType();
			var record = nlapiLoadRecord(recType, recId);
			var reg = 0;
			var countsub = record.getLineItemCount('recmachcustrecord_transaccion_origen');
			
			for(var i = 1; i <= countsub; i++){		
				var nro_contrato_compra = record.getLineItemValue('recmachcustrecord_transaccion_origen','custrecord_nro_contrato_compra',i);
				if (nro_contrato_compra != null){
					reg ++;
				}
			}
			var approvalstatus = record.getFieldValue('approvalstatus');
			var subsidiary = record.getFieldValue('subsidiary');
			
			// var script = "alert(\'Button was clicked from \' + nlapiGetRecordType() + \' in VIEW mode\');";
			
			if (approvalstatus == 2 && subsidiary == 1 && countsub != reg){
				form.setScript('customscript_ptc_ue_copy_purchase_order1');
				//form.setScript('customscript_ptc_cs_copy_purchase_contra');
				var customButton = form.addButton('custpage_boton_copy_contract', 'Generar Contratos de Compra por Subsidiaria', "copy_contra('edit')");
				
			}		
		}
	}
	
	catch(error)
    {
        if(error instanceof nlobjError)
        {
            var errorCode 	 = returnBlank(error.getCode());
            var errorDetails 	 = returnBlank(error.getDetails());
            var errorID 	 = returnBlank(error.getId());
            var errorInternalID	 = returnBlank(error.getInternalId());
            var errorStackTrace	 = returnBlank(error.getStackTrace());
            if(errorStackTrace != '')
            {
            errorStackTrace	 = errorStackTrace.join();
            }
            var errorUserEvent 	 = returnBlank(error.getUserEvent());
            nlapiLogExecution( 'ERROR', 'Error Code',errorCode);
            nlapiLogExecution( 'ERROR', 'Error Details',errorDetails);
            nlapiLogExecution( 'ERROR', 'Error ID',errorID);
            nlapiLogExecution( 'ERROR', 'Error Internal ID',errorInternalID);
            nlapiLogExecution( 'ERROR', 'Error StackTrace',errorStackTrace);
            nlapiLogExecution( 'ERROR', 'Error UserEvent',errorUserEvent);
        }
        else
        {
            var errorString	 = returnBlank(error.toString());
            nlapiLogExecution( 'ERROR', 'Unexpected Error',errorString);
        }
    }
}

function copy_contra(type){
	
		try {
			if (type == 'edit')
				{
			var recId = nlapiGetRecordId();
			var recType = nlapiGetRecordType();
			
			var record = nlapiLoadRecord(recType, recId);
			
			var countsub = record.getLineItemCount('recmachcustrecord_transaccion_origen');
			
			if (countsub > 0){
				
				var entity = record.getFieldValue('entity');
				var employee = record.getFieldValue('employee');
				var trandate = record.getFieldValue('trandate');
				var effectivitybasedon = record.getFieldValue('effectivitybasedon');	
				var minimumamount = record.getFieldValue('minimumamount');
				var maximumamount = record.getFieldValue('maximumamount');
				var memo = record.getFieldValue('memo');
				var custbody_sub_tipo_compra_lic = record.getFieldValue('custbody_sub_tipo_compra_lic');
				var custbody_nro_solicitud = record.getFieldValue('custbody_nro_solicitud');
				var custbody_esp_consultas = record.getFieldValue('custbody_esp_consultas');
				var custbody_mov_otorgamiento = record.getFieldValue('custbody_mov_otorgamiento');
				var custbody_email_esp = record.getFieldValue('custbody_email_esp');
				var terms = record.getFieldValue('terms');	
				var purchaseorderinstructions = record.getFieldValue('purchaseorderinstructions');
				var productlabelinginstructions = record.getFieldValue('productlabelinginstructions');
				var packinglistinstructions = record.getFieldValue('packinglistinstructions');
				var billinginstructions = record.getFieldValue('billinginstructions');			
				var department = record.getFieldValue('department');
				var startdate =  nlapiStringToDate(record.getFieldValue('startdate'));
				var enddate = nlapiStringToDate(record.getFieldValue('enddate'));
				
				var days = enddate.getDate()-startdate.getDate();			
				var contractNewId = new Array();
				var tot_max_amount = 0;		
				var today = new Date();
				var endtoday = nlapiAddDays(today, days);
				today = nlapiDateToString(today);
				endtoday = nlapiDateToString(endtoday);
			}
			else
			{
				alert('No existe registro de subsidiarias destino en la solapa "Subsidiaria Contrato Marco.');
			}
			
			for(var i = 1; i <= countsub; i++){		
				
				var subId = record.getLineItemValue('recmachcustrecord_transaccion_origen','id',i);
				var subsidiary = record.getLineItemValue('recmachcustrecord_transaccion_origen','custrecord_subsidiarias_cm',i);
				var max_amount = record.getLineItemValue('recmachcustrecord_transaccion_origen','custrecord_monto_maximo',i);			
				tot_max_amount = parseFloat(tot_max_amount) + parseFloat(max_amount);	
				
				var contractNew = nlapiCreateRecord('purchasecontract');			
				contractNew.setFieldValue('entity', entity);
				contractNew.setFieldValue('employee', employee);
				contractNew.setFieldValue('trandate', trandate);
				contractNew.setFieldValue('effectivitybasedon', effectivitybasedon);			
				contractNew.setFieldValue('startdate', today);
				contractNew.setFieldValue('enddate', endtoday);
				contractNew.setFieldValue('minimumamount', minimumamount);
				contractNew.setFieldValue('maximumamount', max_amount);
				contractNew.setFieldValue('memo', memo);			
				contractNew.setFieldValue('custbody_sub_tipo_compra_lic', custbody_sub_tipo_compra_lic);
				contractNew.setFieldValue('custbody_nro_solicitud', custbody_nro_solicitud);
				contractNew.setFieldValue('custbody_esp_consultas', custbody_esp_consultas);
				contractNew.setFieldValue('custbody_mov_otorgamiento', custbody_mov_otorgamiento);
				contractNew.setFieldValue('custbody_email_esp', custbody_email_esp);
				contractNew.setFieldValue('terms', terms);	
				contractNew.setFieldValue('purchaseorderinstructions', purchaseorderinstructions);
				contractNew.setFieldValue('productlabelinginstructions', productlabelinginstructions);
				contractNew.setFieldValue('packinglistinstructions', packinglistinstructions);
				contractNew.setFieldValue('billinginstructions', billinginstructions);	
				
				contractNew.setFieldValue('subsidiary', subsidiary);
				contractNew.setFieldValue('department', department);	
				contractNew.setFieldValue('custbody_contrato_origen', recId);
			    
				var count = record.getLineItemCount('item');
			    
			    for(var j = 1; j <= count; j++){		    	
			    	contractNew.selectNewLineItem('item');	    	
			    	contractNew.setLineItemValue('item','item',j,record.getLineItemValue('item','item',j));
			    	contractNew.setLineItemValue('item','rate',j,record.getLineItemValue('item','rate',j));
			    	contractNew.setLineItemValue('item','taxcode',j,record.getLineItemValue('item','taxcode',j));
			    	contractNew.setLineItemValue('item','custcol_departamento',j,record.getLineItemValue('item','custcol_departamento',j));		    	 
			    }

			    try {
			    	contractNewId[i-1] = nlapiSubmitRecord(contractNew);
				} catch (e) {
					nlapiLogExecution('ERROR', 'Error ', 'NetSuite error: Creando Contratos Heredados: ' + e.message);
				}
			    
			    record.selectLineItem('recmachcustrecord_transaccion_origen',i);
			    record.setLineItemValue("recmachcustrecord_transaccion_origen", "custrecord_nro_contrato_compra", i, contractNewId[i-1]);
			}
			
			record.setFieldValue('custbody_contrato_origen', recId);
			record.setFieldValue('maximumamount', tot_max_amount);
			
			try {
				recordId = nlapiSubmitRecord(record);
			} catch (e) {
				nlapiLogExecution('ERROR', 'Error ', 'NetSuite error: Actualizando Contrato Origen: ' + e.message);				
			}			
			
			alert('Los Contratos de Compras fueron Creados Satisfactoriamente.');
		}
		}
		catch(error)
	    {
			alert(error);
	        if(error instanceof nlobjError)
	        {
	            var errorCode 	 = returnBlank(error.getCode());
	            var errorDetails 	 = returnBlank(error.getDetails());
	            var errorID 	 = returnBlank(error.getId());
	            var errorInternalID	 = returnBlank(error.getInternalId());
	            var errorStackTrace	 = returnBlank(error.getStackTrace());
	            if(errorStackTrace != '')
	            {
	            errorStackTrace	 = errorStackTrace.join();
	            }
	            var errorUserEvent 	 = returnBlank(error.getUserEvent());
	            
	            nlapiLogExecution( 'ERROR', 'Error Code',errorCode);
	            nlapiLogExecution( 'ERROR', 'Error Details',errorDetails);
	            nlapiLogExecution( 'ERROR', 'Error ID',errorID);
	            nlapiLogExecution( 'ERROR', 'Error Internal ID',errorInternalID);
	            nlapiLogExecution( 'ERROR', 'Error StackTrace',errorStackTrace);
	            nlapiLogExecution( 'ERROR', 'Error UserEvent',errorUserEvent);
	        }
	        else
	        {
	            var errorString	 = returnBlank(error.toString());
	            nlapiLogExecution( 'ERROR', 'Unexpected Error',errorString);
	        }
	    }
	}