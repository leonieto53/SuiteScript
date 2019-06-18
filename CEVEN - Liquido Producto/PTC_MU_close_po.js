/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

function(record) {
    
    /**
     * Definition of Mass Update trigger point.
     *
     * @param {Object} params
     * @param {string} params.type - Record type of the record being processed by the mass update
     * @param {number} params.id - ID of the record being processed by the mass update
     *
     * @since 2016.1
     */
    function each(context) {
    	var recId;
    	var registro = record.load({
			  type: record.Type.PURCHASE_ORDER,
			  id: context.id
			})
  	
			count = registro.getLineCount({sublistId: 'item'});
		
	  	/// close the global sale order
	  	for ( var j=0; j < count ; j++){	
	  		
	  		registro.setSublistValue({
               sublistId: 'item',
               fieldId: 'isclosed',
               line: j,
               value: true
               });	   		 
  	 
	  	
		  	 try {
		           recId = registro.save();
		           log.debug({
		               title: 'Closed PO:',
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
        each: each
    };
    
});
