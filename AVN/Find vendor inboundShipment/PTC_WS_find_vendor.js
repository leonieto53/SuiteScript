/**
 * @NApiVersion 2.0
 * @NScriptType workflowactionscript
 */
define(['N/record', 'N/search','N/runtime'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search, runtime) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @Since 2016.1
     */
    function onAction(context) {
    	
    	var receiver = runtime.getCurrentScript().getParameter({
    		name : 'custscript_prov_req'
    	});
    	    	
    	var emails = "";
    	
	  	var inboundShipment = record.load({
			  type: 'inboundShipment',
			  id: context.newRecord.id
			});
	  	
	  	var count = inboundShipment.getLineCount({sublistId: 'items'});
	  	
	  	for ( var i=0; i < count ; i++){
	  		
	  		if (receiver == true)
	  			{
		  		var vendorid = inboundShipment.getSublistValue({
		   			 sublistId: 'items', 
					 fieldId: 'vendorid', 
					 line: i
					});
		  		
		  		var email = search.lookupFields({
				    type: search.Type.VENDOR,
				    id: vendorid,
				    columns: ['email']
		  		});
	  			}
	  		else
	  			{
	  			var vendorid = inboundShipment.getSublistValue({
		   			 sublistId: 'items', 
					 fieldId: 'purchaseorder', 
					 line: i
					});
		  		
/*		  		var email = search.lookupFields({
				    type: search.Type.PURCHASE_ORDER,
				    id: vendorid,
				    columns: ['employee']
		  		});*/
	  			// 	Se hizo la consulta completa de la orden porque no esta devolviendo con lookupFields
	  			
			  	var purchase = record.load({
					  type: record.Type.PURCHASE_ORDER,
					  id: vendorid			 
					});	 
			  	
			  	var employee = purchase.getValue('employee');
			  	
		  		var email = search.lookupFields({
				    type: search.Type.EMPLOYEE,
				    id: employee,
				    columns: ['email']
		  		});
	  			
	  			}
	  		
	  		emails = emails + email.email + ',';   

	  	}
		
	  	emails = emails.substring(0,emails.length-1);
	  	
	  	return emails;
    }

    return {
        onAction : onAction
    };
    
});
