/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 * Module Description
 * 
 * Version    Date            Author           			Remarks
 * 1.00       24 abr 2019     Preteco: Leonardo Nieto	Delete SO are not the product liquid and update price
 * 
 */
define(['N/error','N/record','N/redirect'],

function(error,record,redirect) {

	function afterSubmit(context) {
	
		if (context.type === context.UserEventType.DELETE)
	          return false;
		
		var registro = record.load({
		  type: context.newRecord.type,
		  id: context.newRecord.id
		});
		
		var defaultForm = registro.getValue({fieldId: 'customform'});
		var cta_ord = registro.getValue({fieldId: 'custbody_ctayorden'});
		var subsidiary = registro.getValue({fieldId: 'subsidiary'});
		
		if ((defaultForm == 166 || defaultForm == 148) && subsidiary == 5) {
	       var itemId;
	       var deleteRecor
	       var lines;
	       var viewForm = true;
           var priceItem;
           var itemtype;
	
	       lines = registro.getLineCount({
	         sublistId: 'links' });
	       var typeRecord;
	
		   for(var i = 0 ; i < lines ; i ++) {
		       itemId = registro.getSublistValue({
		           sublistId: 'links',
				   fieldId  : 'id',
				   line     : i
		       });
	 
		       typeRecord = registro.getSublistValue({
			       sublistId: 'links',
			       fieldId  : 'type',
			       line     : i
			    });
	 
		       if (typeRecord == "Pedido" || typeRecord == "Purchase Order") {
				   var purchaseorder = record.load({
					   type: record.Type.PURCHASE_ORDER,
					   id  : itemId
				   });
	
				   var entity      = purchaseorder.getValue({fieldId : 'entity'})
				   var subsidiary  = purchaseorder.getValue({fieldId : 'subsidiary'})
				   var createdfrom = purchaseorder.getValue({fieldId : 'createdfrom'})
	
				   if (cta_ord == false){
					   if (entity == 749 && subsidiary == 5 && createdfrom != '') {
					   try {
					           viewForm = false;
					           deleteRecord = record.delete({
					        	   type : record.Type.PURCHASE_ORDER,
					        	   id   : itemId,
					           });
					           log.debug({title:"Delete Purchase Order", details: "Sale Order: " + context.newRecord.id + " - Purchase Order deleted: " + itemId});
					   		}
					   catch (e) {
					
					           log.error({
					        	   title: e.name,
					        	   details: e.message +' Id: '+ itemId
					               		});
							      }
						    }
						}
		       		}
		       
				}
		   
			    if (!viewForm) {
			        redirect.toRecord({
			           type : record.Type.SALES_ORDER,
			           id   : context.newRecord.id
			         });
		        }
			  
		}
   		else if (subsidiary == 5)
		{
			log.error({
            title: 'The form is not product liquid ',
            details: 'Sale Order: ' + registro.id + ' - Id form : '+ defaultForm 
        });
		}
    }

    function beforeSubmit(context) {
	  
           var registro = context.newRecord;
      var cta_ord = registro.getValue({fieldId: 'custbody_ctayorden'});
      var orderstatus = registro.getValue({fieldId: 'orderstatus'});
      var subsidiary = registro.getValue({fieldId: 'subsidiary'});
      // && orderstatus == 'B'
      
      if (cta_ord == true) {

          var defaultForm = registro.getValue({fieldId: 'customform'});

          if ((defaultForm == 166 || defaultForm == 148) && subsidiary == 5) {
               var lines;
               var itemId;
               var priceItem;
               var itemtype;
               var itemRecord;
               var count;           
               var sublistRecord;
               var recId;
           	   var isdropshipitem;


                lines = registro.getLineCount('item');

                for(var i = 0 ; i < lines ; i ++){
                   itemId = registro.getSublistValue({
                       sublistId: 'item',
                       fieldId: 'item',
                       line: i
                   });

                   priceItem = registro.getSublistValue({
                       sublistId: 'item',
                       fieldId: 'rate',
                       line: i
                   });
                   
                   registro.setSublistValue({sublistId: 'item', fieldId: 'porate', line: i, value: priceItem});
                   
                   itemtype = registro.getSublistValue({
                       sublistId: 'item',
                       fieldId: 'itemtype',
                       line: i
                   });

                   if (itemtype === "InvtPart" )
                    {
              	   		itemRecord = record.load({type: record.Type.INVENTORY_ITEM, id: itemId});

                      		isdropshipitem = itemRecord.getValue({fieldId: 'isdropshipitem'});
                      
                      		if (isdropshipitem == true){

                                count = itemRecord.getLineCount({sublistId: 'itemvendor'});

                                for ( var j=0; j < count ; j++)
                                {
                                  if (itemRecord.getSublistValue({sublistId: 'itemvendor', fieldId: 'preferredvendor', line: j}) == true)
                                    {
                                        sublistRecord = itemRecord.getSublistSubrecord({
                                          sublistId: 'itemvendor',
                                          fieldId: 'itemvendorprice',
                                          line: j
                                        });

                                        sublistRecord.setSublistValue({
                                          sublistId: 'itemvendorpricelines',
                                          fieldId: 'vendorprice',
                                          line: j,
                                          value: priceItem});
                                    }
                                 }

                                 }
                      		else
                      			{
	                      			log.error({
	                                    title: 'The item is not isdropshipitem ',
	                                    details: 'Saler order: '+ registro.id + ' Item: ' + itemId 
	                                });
                      			}

                           try {
								if (isdropshipitem == true){
                                    recId = itemRecord.save();
                                    log.debug({
                                        title: 'Update Price',
                                        details: 'Saler order: ' + registro.id + ' - Item: ' + itemId + ' - New price: ' + priceItem
                                    });
                                }
								
                            } 
                      		catch (e) {
                              log.error({
                                title: e.name,
                                details: e.message
                              });
                            }
                           		
                        }
             		else
          			{
              			log.error({
                            title: 'The item is not InvtPart ',
                            details: 'Saler order: '+ registro.id + ' Item: ' + itemId 
                        });
          			}
                }
          }

      } 	
 		else
		{
 			if (subsidiary == 5){
				log.error({
	            title: 'Not is cta_ord = true and status B  ',
	            details: 'Saler order: '+ registro.id + ' - cta_ord: ' + cta_ord + ' - orderstatus ' + orderstatus
				});
			}
		} 
	    }
      
    return {
      
    	beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };

});