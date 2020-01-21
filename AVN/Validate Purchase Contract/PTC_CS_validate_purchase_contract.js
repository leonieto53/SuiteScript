/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param {record} record
 */
function(record, search) {
    

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(context) {
    	
	  	var currentRecord = context.currentRecord;
	  	var FieldName = context.fieldId;
	  	
	  	var purchasecontractId = currentRecord.getValue({
	  		fieldId: "purchasecontract"});
	  	
//	  	var subtipo_compra_pur = currentRecord.getValue({
//	  		fieldId: "custbody_subtipo_compra"});
	  	
	  	var subtipo_compra_pur_text = currentRecord.getText({
	  		fieldId: "custbody_subtipo_compra"});
	  		  		  
	  	if (purchasecontractId > 0)
	  		{
		  	var total = currentRecord.getValue({
		  		fieldId: "total"});
		  	
		  	// Busca el contrato de compras
	        var purchasecontract = record.load({
	            type: record.Type.PURCHASE_CONTRACT,
	            id: purchasecontractId
	          });
	        
		  	var tranid = purchasecontract.getValue({
		  		fieldId: "tranid"});
		  	
	        purchasedamount = purchasecontract.getValue({
	        	fieldId: "purchasedamount"});
	        
	        importe_maximo = purchasecontract.getValue({
	        	fieldId: "custbody_importe_maximo"});
	        
	        var subtipo_compra_cont = purchasecontract.getText({
		  		fieldId: "custbody_sub_tipo_compra_lic"});	
	        
	        // Valida que el sub-tipo del pedido sea igual al sub-tipo del contrato de compra seleccionado
	        if (subtipo_compra_cont != subtipo_compra_pur_text)
	        {
	        	alert('El contrato de compra seleccionado no es de tipo ' + subtipo_compra_pur_text);
	        	return false;
	        }
	        
	        // Valida que el pedido no exceda del importe comprado
	        if (importe_maximo > 0)
	        { 
		        var purchasetotal = purchasedamount + total;
		        
		        if (purchasetotal > importe_maximo)
		        	{
		        	alert('Ha excedido el limite de compras para el Contrato Nro. ' + tranid);
		        	return false;
		        	}
		  		}
	  		}
        return true;       
	  	
    }

    return {

        saveRecord: saveRecord
    };
    
});
