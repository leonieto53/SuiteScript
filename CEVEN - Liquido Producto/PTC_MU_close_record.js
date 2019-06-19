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
    	var entity;
    	var addresId;
    	
    	var registro = record.load({
			  type: context.type,
			  id: context.id
			})
			
			entity = registro.getValue({fieldId : 'entity'});
    		
    		var customer = record.load({
			  type: record.Type.CUSTOMER,
			  id: entity
			})
    		
    		
    		addressId = customer.getSublistValue({sublistId: 'addressbook', fieldId: 'id', line: 1});
    		
    		registro.setValue({fieldId : 'shipaddresslist', value : addressId});
    		
			count = registro.getLineCount({sublistId: 'item'});
		
	  	/// close the global sale order
	  	for ( var j=0; j < count ; j++){	
	  		
	  		registro.setSublistValue({
               ignoreMandatoryFields: true,
               sublistId: 'item',
               fieldId: 'isclosed',
               line: j,
               value: true
               });	   		 
		  	
			  	
		  	 try {
		           recId = registro.save();
		           log.debug({
		               title: context.type,
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