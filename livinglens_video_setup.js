<div id="info">Please explain your feelings towards the video you just watched. The video recording should be at least 5 seconds long and no more than 6 minutes long.</div>
<br/><br/>
<div id="livinglens-media-capture" 
	data-apikey="xxxxxxx" 
	data-clientid="xxxxxxx" 
	data-media="video" 
	data-respondentid="^CurrentPID()+'_'+CurrentID()^" 
	data-countrycode="US" 
	data-languagecode="EN" 
	data-minwidth="700" 
	data-maxwidth="1024"
	data-minlength="5"
	data-maxlength="360">
</div>





<script>

	/* ASSUMPTIONS: 
	1. you were given your own apikey and clientid from LivingLens
	2. this page contains in this order... 
		a. an Info node with a div containing the LivingLens attributes
		b. a Multi with one answer code "y" with a label like "Check this if you do not see the recording frame"
		c. an Open Text with id "videoId" hidden using CSS	
	3. you build out the filters array using the questions and answers you want to pass to LivingLens
	*/
	
	$(document).ready(function() {

		checkbox = Confirmit.page.questions[1]; 
  		hiddentext = document.getElementById('videoId_input'); 
		forwardbutton = document.getElementsByClassName("cf-navigation-next")[0]; 
		navcontainer = document.getElementsByClassName('cf-page__navigation')[0]; 
	
		function toggle(show) {  
			// ---remove the forward button or put it back
			if(!show) {
				navcontainer.removeChild(navcontainer.children[1]);
			}
			else if(show) {
				navcontainer.appendChild(forwardbutton);
			}
		}
	
		function checkToggle() {
			// ---a handler for the 'technical difficulty' button
			if(checkbox.values[0] == "y") {
				toggle(true);
			}
			else {
				toggle(false);
			}
		}

		checkbox.changeEvent.on(checkToggle); 


		var filters = [
			{
				group: "AnnualMembership", 
				filters: ["^f('q1').valueLabel()^"]
			},
			{
				group: "Trips", 
				filters: ["^f('q3')^"]
			},
			{
				group: "NetPromoterScore", 
				filters: ["^f('q4')^"]
			}
		];
		
		var callback = function(mediaCapture) {
			mediaCapture.onEvent('uploadSuccessful', function(event){
				hiddentext.value = event.uploadId;
				checkbox.changeEvent.off(checkToggle);
				toggle(true); 
			});
			mediaCapture.onEvent('readyToRecord', function(event){
				document.getElementById('info').style.display = "none";
			});
			mediaCapture.onEvent('noRecordingDevice', function(){
				PostError("ERROR: No Recording Device Found");			
			});
			mediaCapture.onEvent('noMicrophone', function(){
				PostError("ERROR: No Microphone Device Found");
			});
			mediaCapture.onEvent('uploadAborted', function(){
				PostError("ERROR: Upload Aborted - network related issues or user navigated away");
			});
			mediaCapture.onEvent('uploadFailed', function(){
				PostError("ERROR: Upload Failed");
			});
		};
	
		// ---should start without the forward button
		checkToggle();  
		LivingLens.startMediaCapture({
			// ---start up LivingLens 
			target: 'livinglens-media-capture', 
			filters: filters,
			callback: callback
		});
	
	
		function PostError(errorMsg) {
			// ---save the error message even if they give up and close before submitting the page
			var destination = "^GetRespondentUrl()^"; 
			destination = destination.replace("http","https");	
			var sid = document.getElementById('__sid__').value; 
			var respData = { "videoId" : errorMsg, "__sid__" : sid };	
		
			$.ajax({
				type : "POST",
				url : destination,
				dataType : "text", 
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				data : respData,
				error : function(xhr,status,error){
					console.log("could not POST Living Lens error: " + error);
				}
			});
		
			hiddentext.value = errorMsg;
			checkbox.changeEvent.off(checkToggle);
			toggle(true);
		}
		
	});
</script>
