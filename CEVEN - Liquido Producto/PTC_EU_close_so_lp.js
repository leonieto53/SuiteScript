/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* 
* Module Description
* 
* Version    Date            Author           			Remarks
* 1.00       03 jun 2019     Preteco: Leonardo Nieto	Close sale orders LP
* 
*/

define(['N/error','N/record'],

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
    	
    	var purchaseorder;
    	var saleorderclosed;
	  	var orderdoc;
	  	var orderdoprev;
	  	var intercotransaction;
	  	
	  	var salesorder = record.load({
			  type: context.newRecord.type,
			  id: context.newRecord.id
			});
	  	
	  	if (salesorder.getValue({fieldId: 'entity'}) != '10949'){
	  		return false;
	  	} 
	  	
	  	count = salesorder.getLineCount({sublistId: 'item'});
	  	
	  	for ( var i=0; i < count ; i++){
	  		
	   		orderdoc = salesorder.getSublistValue({
    			 sublistId: 'item', 
    			 fieldId: 'custcol_ptc_po_lp', 
    			 line: i
    			 });
	   		
	   		if (orderdoprev != orderdoc){
	   			purchaseorder = record.load({
					  type: record.Type.PURCHASE_ORDER,
					  id: orderdoc
					});
		 	  	
		 	  	intercotransaction = purchaseorder.getValue({fieldId: 'intercotransaction'});
		 	  	
		 	  	saleorderclosed = record.load({
					  type: record.Type.SALES_ORDER,
					  id: intercotransaction
					});
		 	  	
		 	  	count2 = saleorderclosed.getLineCount({sublistId: 'item'});
		 	  	
		 	  	for ( var j=0; j < count2 ; j++){		    		 
		 	  		saleorderclosed.setSublistValue({
		                 sublistId: 'item',
		                 fieldId: 'isclosed',
		                 line: j,
		                 value: true
		                 });	   		 
		    	 }
		 	  	
		    	 try {
	                 recId = saleorderclosed.save();
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
	   		
	 	  	
	   		orderdoprev = orderdoc;
   		
   	 }
	  	
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
