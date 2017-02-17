<div id="info">Please explain your feelings towards the video you just watched. The video recording should be at least 5 seconds long and no more than 6 minutes long.</div>
<br/><br/>
<div id="livinglens-media-capture" 
	data-apikey="A58E904C-A3F8-4465-B4EF-73E3D3A9839C" 
	data-clientid="56d41cbef25371137ccd27b3" 
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
	2. your survey has a forward navigation button and its id is "forwardbutton"
	3. this page has a Multi with id "td" and one answer code "y" with a label like "Check this box if you do not see the recording frame"
	4. this page has an Open Text with id "videoId" hidden using CSS
	5. you build out the filters array using the questions and answers you want to pass to LivingLens
	*/

	fb = document.getElementById('forwardbutton');
	td = document.getElementById('td_y'); 
	
	function toggle(nav){  
		// ---remove the forward button or put it back
		container = document.getElementsByClassName('navforward')[0];
		if(!nav){
			if(container){
				container.removeChild(container.childNodes[0]);
			}
		}
		else if(nav){
			if(container){
				container.appendChild(fb);
			}
		}
	}
	
	function checkToggle(){
		// ---a handler for the 'technical difficulty' button
		var difficulty = document.getElementById('td_y').checked;	
		if(difficulty){
			toggle(true);
		}
		else{
			toggle(false);
		}
	}
	
	td.addEventListener("click", checkToggle);
	
	
	var filters = [
		{
			group: "Question text or title goes here", 
			filters: ["^f('qid').valueLabel()^"]
		},
		{
			group: "Question text or title goes here", 
			filters: ["^f('qid')^"]
		},
		{
			group: "Question text or title goes here", 
			filters: ["^f('qid')^"]
		}
	];
		
	var callback = function(mediaCapture){
		mediaCapture.onEvent('uploadSuccessful', function(event){
			document.getElementById('videoId').value = event.uploadId;
			td.removeEventListener("click", checkToggle);
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
	
	
	function PostError(errorMsg){
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
		
		document.getElementById('videoId').value = errorMsg;
		td.removeEventListener("click", checkToggle);
		toggle(true);
	}
	
</script>




 

