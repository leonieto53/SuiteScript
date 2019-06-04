/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* 
* Module Description
* 
* Version    Date            Author           			Remarks
* 1.00       03 jun 2019     Preteco: Leonardo Nieto	Update ID Purcharse order in vendorbill
* 
*/

define(['N/error','N/record'],
/**
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
    	
    	var orderdoc;
    	
    	var vendorbill = record.load({
  		  type: context.newRecord.type,
  		  id: context.newRecord.id
  		});
    	
    	if (vendorbill.getValue({fieldId: 'entity'}) == '749'){    		
    	
	    	count = vendorbill.getLineCount({sublistId: 'item'});
	    	
	    	 for ( var i=0; i < count ; i++){
	    		 orderdoc = vendorbill.getSublistValue({
					    			 sublistId: 'item', 
					    			 fieldId: 'orderdoc', 
					    			 line: i
					    			 });
	    		 
	    		 vendorbill.setSublistValue({
	                 sublistId: 'item',
	                 fieldId: 'custcol_ptc_po_lp',
	                 line: i,
	                 value: orderdoc
	                 });	    		 
	    		
	    	 }
	    	 
	    	 try {
                 recId = vendorbill.save();
                 log.debug({
                     title: 'Update Pedido LP',
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

    }

    return {
        afterSubmit: afterSubmit
    };
    
});
