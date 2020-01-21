/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime','N/format'],

function(search, record, runtime, format) {
   
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
         
	        var filters = runtime.getCurrentScript().getParameter({name: 'custscript_filter_parameter'});
	        var jsonData = JSON.parse(filters);
	        log.debug('getInputData jsonData', jsonData);
	        var trandate = jsonData.trandate;
	        var fromdate = jsonData.fromdate;
	        var todate = jsonData.todate;	        
	        var subsidiary = jsonData.subsidiary;
	    
	        
	       return search.create({
	            type: record.Type.SALES_ORDER,
	            filters: [	
	            	['mainline',search.Operator.IS, true],
	            	'AND',
	            	['trandate',search.Operator.ONORAFTER,fromdate],
	                'AND',
	                ['trandate',search.Operator.ONORBEFORE,todate],
	                'AND',
	                ['subsidiary',search.Operator.ANYOF,subsidiary],
	                'AND',
	                ['status',search.Operator.ANYOF,['SalesOrd:F']]
	                ],
	            columns: ['internalid'],
	            title: 'Sale Order to Invoice'
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
	        var filters = runtime.getCurrentScript().getParameter({name: 'custscript_filter_parameter'});
	        var jsonData = JSON.parse(filters);
	        //log.debug('Map jsonData', jsonData);
	        
	        var saleorderId = searchResult.id;
	        var trandatestring = jsonData.trandate;	        
	        
	        var trandate = format.parse({
                value: trandatestring,
                type: format.Type.DATE
            });
	        
	       var invoice = record.transform({
	            fromType: record.Type.SALES_ORDER,
	            fromId: saleorderId,
	            toType: record.Type.INVOICE,
	            isDynamic: true	            
	        });
	        
	       invoice.setValue({
	            fieldId: 'trandate',
	            value: trandate
	        	});
	        	
	       var invoiceId = invoice.save({	    		
	    		'ignoreMandatoryFields':true
	    	});
    	}
    	
    	catch(ex){
    	    log.error('map error: ', ex.message);
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
        reduce: reduce,
        summarize: summarize
    };
    
});
