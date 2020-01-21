/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Sep 2019     Preteco
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoad(type, form, request){
	try{
        if (type == 'create'){

          var currentRecord = nlapiGetNewRecord();
          var count = currentRecord.getLineItemCount('item');

          for(var i = 1; i <= count; i++)    {

              var itemid = currentRecord.getLineItemValue('item','item',i);

              var taxschedule_item = nlapiLookupField('noninventoryitem', itemid, 'taxschedule');

              var taxscheduleitem_record = nlapiLoadRecord('taxschedule', taxschedule_item);

              var salestaxcode = taxscheduleitem_record.getLineItemValue('nexuses','salestaxcode',1);

              currentRecord.setLineItemValue('item','taxcode',i,salestaxcode);
          }
        }
      }

      catch(error)
      {
          if(error instanceof nlobjError)
          {
              var errorCode 	 = returnBlank(error.getCode());
              var errorDetails 	 = returnBlank(error.getDetails());
              var errorID 	 = returnBlank(error.getId());
              var errorInternalID	 = returnBlank(error.getInternalId());
              var errorStackTrace	 = returnBlank(error.getStackTrace());
              if(errorStackTrace != '')
              {
              errorStackTrace	 = errorStackTrace.join();
              }
              var errorUserEvent 	 = returnBlank(error.getUserEvent());
              nlapiLogExecution( 'ERROR', 'Error Code',errorCode);
              nlapiLogExecution( 'ERROR', 'Error Details',errorDetails);
              nlapiLogExecution( 'ERROR', 'Error ID',errorID);
              nlapiLogExecution( 'ERROR', 'Error Internal ID',errorInternalID);
              nlapiLogExecution( 'ERROR', 'Error StackTrace',errorStackTrace);
              nlapiLogExecution( 'ERROR', 'Error UserEvent',errorUserEvent);
        }
        else
        {
            var errorString	 = returnBlank(error.toString());
            nlapiLogExecution( 'ERROR', 'Unexpected Error',errorString);
        }
    }
 
}
