/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    
    	try{	

/*   	return search.create({
            type: 'purchaseorder',
            filters: [
            	['mainline',search.Operator.IS, false],
            	'AND',
            	['taxline',search.Operator.IS, false],
            	'AND',
            	['itemtype',search.Operator.IS, 'NonInvtPart']
            	],
            columns: [{name : 'item.internalid',
            		   summary: search.Summary.GROUP},
            	
            	{name : 'rate',
            	 summary: search.Summary.MAX}],
            
            title: 'Update Last Purchase Price'
        });	*/
    	return search.load({
    	    id: 'customsearch_ultima_compra'
    	});	
    		

    	}
    	
    	catch(ex){
    	    log.error('getInputData error: ', ex.message);
    	    }
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	try{
    		searchResult = JSON.parse(context.value);
    		//log.debug('Contenido: ', searchResult);
    		
    		itemId = searchResult['values']['GROUP(internalid.item)']['value']
    		typeitem = searchResult['values']['GROUP(type.item)']['value']
    		cost_new = searchResult['values']['MAX(rate)']    		
    		
    		if (typeitem == 'NonInvtPart')
    			{
    				  				
		    		var item = record.submitFields({
		    		    type: record.Type.NON_INVENTORY_ITEM,
		    		    id: itemId,
		    		    values: {
		    		        cost: cost_new
		    		    },
		    		    options: {
		    		        enableSourcing: false,
		    		        ignoreMandatoryFields : true
		    		    }
		    		});
		    		log.debug('id item updated: ', itemId);
    			}
    		
    	//  Inventory item
    		if (typeitem == 'InvtPart')
    			{
    				
		    		var item = record.submitFields({
		    		    type: record.Type.INVENTORY_ITEM,
		    		    id: itemId,
		    		    values: {
		    		        cost: cost_new
		    		    },
		    		    options: {
		    		        enableSourcing: false,
		    		        ignoreMandatoryFields : true
		    		    }
		    		});
		    		log.debug('id item updated: ', itemId);
    			}
    	}
    	
    	
    	catch(ex){
    	    log.error('Map error: ', ex.message);
    	    }
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce : reduce,
        summarize : summarize
    };
    
});