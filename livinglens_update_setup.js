<div id="livinglens-media-capture" 
	data-apikey="xxxxxxxxx" 
	data-clientid="xxxxxx"
	data-media="update" 
	data-respondentid="^CurrentPID()+'_'+CurrentID()^" 
	data-countrycode="US"
	data-languagecode="EN"
	data-maxwidth="10">
</div>





<script>
	
	/* ASSUMPTIONS: 
	1. you were given your own apikey and clientid from LivingLens
	2. an Open Text question with the id "videoId" exists and contains a LivingLens uploadId which was assigned during a prior video capture.  
	3. you build out the filters array using the questions and answers you want to pass to LivingLens
	*/

	var uploadId = "^f('videoId').get()^";
	if( uploadId && (uploadId.length > 0) && (uploadId.indexOf('ERROR')!== -1) ){
	
		var filters = [
			{ 
				group: "Question text or title goes here", 
				filters: ["^f('qid').valueLabel()^"] 
			}
		];

		function callback(mediaCapture){
			mediaCapture.onEvent('componentReady', function() {
				mediaCapture.appendFilters(uploadId, filters);
			});
		}

		LivingLens.startMediaCapture({
			target:'livinglens-media-capture',
			callback: callback
		});
  
	}
	
</script>
