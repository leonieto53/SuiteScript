/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search) {
    
    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(context) {
    	var currentRecord = context.currentRecord;
		var FieldName = context.fieldId;
        

		if (FieldName === 'custbody_oc_relacionada')
		{
			var oc_relacionada = currentRecord.getValue({
	            fieldId: "custbody_oc_relacionada"});	
			
			if (oc_relacionada)
				{
			
					var vendorId = search.lookupFields({
					    type: search.Type.PURCHASE_ORDER,
					    id: oc_relacionada,
					    columns: ['entity']
					});
					
					 currentRecord.setValue({
			              fieldId: 'custbody_proveedor',
			              value: vendorId.entity[0].value
			          	});	
				}
			else
				 {
					currentRecord.setValue({
		              fieldId: 'custbody_proveedor',
		              value: null
		          	});	
				 }
				
			
		}
    }
    

    return {
        
        fieldChanged: fieldChanged
       
    };
    
});
