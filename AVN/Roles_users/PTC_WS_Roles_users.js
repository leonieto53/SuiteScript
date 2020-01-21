/**
 * @NApiVersion 2.0
 * @NScriptType workflowactionscript
 */
define(['N/runtime', 'N/search'],
/**
 * @param {runtime} runtime
 * @param {search} search
 */
function(runtime, search) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @Since 2016.1
     */
    function onAction(context) {
    	var Rols = runtime.getCurrentScript().getParameter({
    		name : 'custscript_ptc_rol'
    	});
    	 	
    	var mySearch = search.create({
    	    type: 'employee',
    	    columns: ['email'],
    	    filters: [
    	        search.createFilter({
    	            name: 'internalid',
    	            join: 'role',
    	            operator: search.Operator.ANYOF,
    	            values: [Rols]
    	        })
    	    ]
    	});

	    var resultset = mySearch.run();
	    var results = resultset.getRange(0, 100);
	    var emails = '';
	    for(var i in results){
	      var result = results[i];
	      for(var k in result.columns){
	        emails = emails + result.getValue(result.columns[k]) + ',';             
	      }
	    }
		
	    emails = emails.substring(1,emails.length-1);
	      
	    return emails;
    }

    return {
        onAction : onAction
    };
    
});
