/**
 * Module Description
 * 
 * Version    Date            Author           			Remarks
 * 1.00       05 jun 2019     Preteco: Leonardo Nieto	Add lines the impact LM for product liquid in vendor bill
 *
 */


function customizeGlImpact(transactionRecord, standardLines, customLines, book)
{

	var entity = transactionRecord.getFieldValue('entity');
	var subsidiary = transactionRecord.getFieldValue('subsidiary');
	var representingsubsidiary = transactionRecord.getFieldValue('representingsubsidiary');
	
	//if (entity == '749' && subsidiary == '5' && representingsubsidiary == '7'){
	
	    var lines = transactionRecord.getLineItemCount('item');
	    
	    for (var i = 1; i <= lines; i++) {
	    	
	    	var currentItem = transactionRecord.getLineItemValue('item', 'item', i);
	    	var itemtype = transactionRecord.getLineItemValue('item', 'itemtype', i);
	    		    	    	
	    	if (itemtype == 'InvtPart') {
	    		
	    		var description = transactionRecord.getLineItemValue('item', 'description', i);
	    		
	    		var item = nlapiLoadRecord('inventoryitem', currentItem);
	    		account = item.getFieldValue('dropshipexpenseaccount');
	
	    		var quantity = transactionRecord.getLineItemValue('item', 'quantity', i);
	    		var rate = transactionRecord.getLineItemValue('item', 'rate', i);
	    			
	    		var newLine = customLines.addNewLine();
	            newLine.setCreditAmount(quantity*rate);
	            newLine.setAccountId(parseFloat(account));
	            newLine.setEntityId(standardLines.getLine(i).getEntityId());
	            newLine.setMemo(description);
	                    
	            var newLine = customLines.addNewLine();
	            newLine.setDebitAmount(quantity*rate);
	            newLine.setAccountId(1069);  
	            newLine.setEntityId(standardLines.getLine(i).getEntityId());
	            newLine.setMemo(description);
	    	}
	    }
 	//}
}

