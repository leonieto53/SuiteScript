/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget','N/task', 'N/redirect'],
/**
 * @param {record} record
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(record, search, serverWidget, task, redirect) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    
	    	var request = context.request;
	    	var response = context.response;
	    	
	    	if (request.method === 'GET') {
	    		
	    		var form = serverWidget.createForm({
	                title: 'Demo Liquidacion de Expensas'
	            });
	            
	            var subsidiary = form.addField({
	                id: 'custpage_ptc_subsidiaria',
	                type: serverWidget.FieldType.MULTISELECT,
	                label: 'Subsidiaria',
	                source: 'subsidiary'
	            });
	            
	            var fromdate = form.addField({
	                id : 'custpage_ptc_fromdate',
	                type : serverWidget.FieldType.DATE,
	                label : 'Desde'
	            });
	            
	            var todate = form.addField({
	                id : 'custpage_ptc_todate',
	                type : serverWidget.FieldType.DATE,
	                label : 'Hasta'
	            });
	            
	            var trandate = form.addField({
	                id : 'custpage_ptc_trandate',
	                type : serverWidget.FieldType.DATE,
	                label : 'Fecha Factura'
	            });
	            
	            form.addSubmitButton({
	                label: 'Enviar'
	            });
                        
/*                           
           var sublist = form.addSublist({
            	 id : 'sublist',
            	 type : serverWidget.SublistType.LIST,
            	 label : 'List Type Sublist'
            	});

            	var check = sublist.addField({
            	 id : 'custpage_id',
            	 label : 'Check',
            	 type : serverWidget.FieldType.CHECKBOX
            	});
            	check.updateDisplayType({displayType: serverWidget.FieldDisplayType.ENTRY});

            	var itm_id = sublist.addField({
            	 id : 'custpage_item',
            	 label : 'Item Id',
            	 type : serverWidget.FieldType.TEXT
            	});*/
            
	            response.writePage(form);
	            
    	}  
    	else{ //POST
        	var request = context.request;
        	var response = context.response;
        	
    		var delimiter = /\u0005/;
    		var todate = request.parameters.custpage_ptc_todate;
			var fromdate = request.parameters.custpage_ptc_fromdate;			
			var trandate = request.parameters.custpage_ptc_trandate;
			var subsidiary = request.parameters.custpage_ptc_subsidiaria.split(delimiter);   
			
			//Send filters as object using a parameter
			var objparam = JSON.stringify({'fromdate': fromdate,'todate': todate,'trandate': trandate, 'subsidiary': subsidiary});
			
			//Create task to call Map/Reduced
			var mrTask = task.create({
			taskType: task.TaskType.MAP_REDUCE,
			scriptId: 'customscript_liquidacion_expensa',
			deploymentId: 'customdeploy_liquidacion_expensa',
			params: {'custscript_filter_parameter': objparam}
			});
			var mrTaskId = mrTask.submit();
			var taskStatus = task.checkStatus(mrTaskId);
			log.debug('taskStatus', taskStatus);
			
			redirect.redirect({
			    url: '/app/site/hosting/scriptlet.nl?script=323&deploy=1'
			});

    	}
    		
    }

    return {
        onRequest: onRequest
    };
    
});
