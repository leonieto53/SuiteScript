/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/record'],
/**
 * @param {error} error
 * @param {record} record
 */
function(error, record) {

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
    	
    	if (context.type === context.UserEventType.DELETE)
	          return false;
    	
    	var saleorder;
    	
    	var invoice = record.load({
    		  type: context.newRecord.type,
    		  id: context.newRecord.id
    		});
    	
		var createdfrom = invoice.getValue({fieldId: 'createdfrom'});
		
		var len = createdfrom.length;
		
		if (createdfrom.length == 0){
			return false;
		}
    	
    	if (invoice.getValue({fieldId: 'entity'}) == '10949'){  
    		
    		/// close the global sale order
    		
/*    		var createdfrom = invoice.getValue({fieldId: 'createdfrom'});
    		
    		var len = createdfrom.length;
    		
    		if (createdfrom.length == 0){
    			return false;
    		}*/
    		
    		saleorder = record.load({
				  type: record.Type.SALES_ORDER,
				  id: createdfrom
				})
        	
        	count = saleorder.getLineCount({sublistId: 'item'});
    		
	 	  	
	 	  	for ( var j=0; j < count ; j++){	
	 	  		
	 	  		saleorder.setSublistValue({
	                 sublistId: 'item',
	                 fieldId: 'isclosed',
	                 line: j,
	                 value: true
	                 });	   		 
	    	 }
	 	  	
	    	 try {
                 recId = saleorder.save();
                 log.debug({
                     title: 'Closed SO:',
                     details: recId
                 });
             				
             } 
       		 catch (e) {
                 log.error({
                    title: e.name,
                    details: e.message
               });
             }
    	}
    	
    	else{
    		
    		/// update the purchase order whit number invoice the sale order of client
    		var linktype;	
    		var linktypeId;
    		
    		saleorder = record.load({
				  type: record.Type.SALES_ORDER,
				  id: createdfrom
				})
      	
			count = saleorder.getLineCount({sublistId: 'links'});
    		
    		for ( var j=0; j < count ; j++){	
	 	  				
    			linktype = saleorder.getSublistValue({
	                 sublistId: 'links',
	                 fieldId: 'linktype',
	                 line: j
	                 });	
    			
	 	  		if (linktype == 'Envío directo'){
	 	  			
	 	  			linktypeId = saleorder.getSublistValue({
		                 sublistId: 'links',
		                 fieldId: 'id',
		                 line: j
		                 });
	 	  			
	 	  			purchaseorder = record.load({
	 					  type: record.Type.PURCHASE_ORDER,
	 					  id: linktypeId
	 					});
	 	  			
	 	  			purchaseorder.setValue({
		                 fieldId: 'custbody_ov_facturada',		                 
		                 value: invoice.id
		                 });
	 	  			
	 	  			purchaseorder.setValue({
		                 fieldId: 'custbody_facturada',		                 
		                 value: true
		                 });
	 	  			
	 	  			
	 	  			try {
	 	                 recId = purchaseorder.save();
	 	                 log.debug({
	 	                     title: 'OV Facturada:',
	 	                     details: Invoice.id
	 	                 });
	 	             				
	 	             } 
	 	       		 catch (e) {
	 	                 log.error({
	 	                    title: e.name,
	 	                    details: e.message
	 	               });
	 	             }	
	 	  		}
	 	  		
	    	 }
    		
    		
    	}
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
