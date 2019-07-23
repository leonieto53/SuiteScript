/**
 * Module Description
 * 
 * Version    Date            Author           			Remarks
 * 1.00       23 jul 2019     Preteco: Leonardo Nieto	Change impact LM when there is FOSI
 *
 */


function customizeGlImpact(transactionRecord, standardLines, customLines, book)
{

	var custbody_fondo = transactionRecord.getFieldValue('custbody_fondo');
	
	if (custbody_fondo.length > 0){
	
	    var lines = transactionRecord.getLineItemCount('item');
	    var department = transactionRecord.getFieldValue('department');
	    
	    for (var i = 1; i <= lines; i++) {
	    	
	    	var currentItem = transactionRecord.getLineItemValue('item', 'item', i);
	    	var itemtype = transactionRecord.getLineItemValue('item', 'itemtype', i);	    	
	    		    	    	
	    	if (itemtype == 'NonInvtPart' || itemtype == 'InvtPart') {
	    		
	    		if (itemtype == 'NonInvtPart'){
	    			var item = nlapiLoadRecord('noninventoryitem', currentItem);
	    			expenseaccount = item.getFieldValue('expenseaccount');	
	    		}
	    		
	    		if (itemtype == 'InvtPart'){
	    			var item = nlapiLoadRecord('inventoryitem', currentItem);
	    			expenseaccount = item.getFieldValue('assetaccount');
	    		}
	    		
	    		var description = transactionRecord.getLineItemValue('item', 'description', i);	
	    		var quantity = transactionRecord.getLineItemValue('item', 'quantity', i);
	    		var rate = transactionRecord.getLineItemValue('item', 'rate', i);
	    		
	    		var newLine = customLines.addNewLine();
	            newLine.setDebitAmount(quantity*rate);
	            newLine.setAccountId(parseFloat(custbody_fondo));
 	            newLine.setEntityId(standardLines.getLine(i).getEntityId());
	            newLine.setMemo(department);
	            
	            var newLine = customLines.addNewLine();
	            newLine.setCreditAmount(quantity*rate);
	            newLine.setAccountId(parseFloat(expenseaccount));  
	            newLine.setEntityId(standardLines.getLine(i).getEntityId());
	            newLine.setMemo(department);
	    		
	    	}
	    }
 	}
}

