/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
   

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(context) {
    	
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
    	try{
    		
        	if (context.type === context.UserEventType.DELETE)
  	          return false;
                	
		  	var currentRecord = record.load({
				  type: context.newRecord.type,
				  id: context.newRecord.id			 
				});
		  	
		  	// update estimate price
		  	var count = currentRecord.getLineCount({sublistId: 'item'});
		  	
		  	for ( var i=0; i < count ; i++){
		  			
				var estimatedrate = currentRecord.getSublistValue({
	   			 sublistId: 'item', 
				 fieldId: 'estimatedrate', 
				 line: i
				});
				
				var rate = currentRecord.getSublistValue({
		   			 sublistId: 'item', 
					 fieldId: 'rate', 
					 line: i
					});
					
				if (estimatedrate == 0 && rate > 0)
					return true;
				
				if (estimatedrate > 0)
				{
					currentRecord.setSublistValue({
						sublistId: 'item',
					    fieldId: 'rate',
					    line: i,
					    value: estimatedrate
					});					
				}					

		  	}
		  	
		  	// accumulate maximum amount
		  	if (currentRecord.getValue('customform') == 113){
			  	var count = currentRecord.getLineCount({sublistId: 'recmachcustrecord_transaccion_origen'});
			  	var amount = 0; 
			  	for ( var i=0; i < count ; i++){
			  			
					var monto_maximo = currentRecord.getSublistValue({
		   			 sublistId: 'recmachcustrecord_transaccion_origen', 
					 fieldId: 'custrecord_monto_maximo', 
					 line: i
					});
												
					amount = amount + monto_maximo;				
	
			  	}
			  	
		        currentRecord.setValue({
		              fieldId: 'custbody_importe_maximo',
		              value: amount
		          	});			  
		  	}
		  	
			currentRecord.save({
			    enableSourcing: true,
			    ignoreMandatoryFields: true
			});
    	}
		  	
  		 catch (e) {
             log.error({
                title: e.name,
                details: e.message
           });
	  	}
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
