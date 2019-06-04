/**
 * Module Description
 * 
 * Version    Date            Author           			Remarks
 * 1.00       24 abr 2019     Preteco: Leonardo Nieto	Add lines the impact LM for product liquid
 *
 */


function customizeGlImpact(transactionRecord, standardLines, customLines, book)
{

	var entity = transactionRecord.getFieldValue('entity');
	var subsidiary = transactionRecord.getFieldValue('subsidiary');
    
  
	if (entity == 749 && subsidiary == 5){
	
	    var lines = transactionRecord.getLineItemCount('item');
	    
	    for (var i = 1; i <= lines; i++) {
	    	
	    	var currentItem = transactionRecord.getLineItemValue('item', 'item', i);
	    	var itemtype = transactionRecord.getLineItemValue('item', 'itemtype', i);
	    	    	
	    	if (itemtype == 'InvtPart') {
	    		
	    		var item = nlapiLoadRecord('inventoryitem', currentItem);
	    		account = item.getFieldValue('dropshipexpenseaccount');
	
	    		var quantity = transactionRecord.getLineItemValue('item', 'quantity', i);
	    		var rate = transactionRecord.getLineItemValue('item', 'rate', i);
	    			
	    		var newLine = customLines.addNewLine();
	            newLine.setCreditAmount(quantity*rate);
	            newLine.setAccountId(parseFloat(account));
	            newLine.setEntityId(standardLines.getLine(i).getEntityId());
	            newLine.setMemo('Ajuste por liquido producto.');
	
	            var newLine = customLines.addNewLine();
	            newLine.setDebitAmount(quantity*rate);
	            newLine.setAccountId(1069);  
	            newLine.setMemo('Ajuste por liquido producto.');
	    		
	    	}
	    }
    
  /*  for (var i = 0; i < standardLines.getCount(); i++) {
    	if (standardLines.getLine(i).getAccountId() == '1078') {
            var newLine = customLines.addNewLine();
            newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
            newLine.setAccountId(1078);
            newLine.setEntityId(standardLines.getLine(i).getEntityId());
            newLine.setMemo('Ajuste por liquido producto.');

            var newLine = customLines.addNewLine();
            newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
            newLine.setAccountId(1069);  
            newLine.setMemo("Ajuste por liquido producto.");
        }
  	}*/
    
    

  }
}

