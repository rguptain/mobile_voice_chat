/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var accessToken = "31a9215698df4fe686a11cfa30a84137";
var baseUrl = "https://api.api.ai/v1/";
var recognition;
var agent_id;

$(function()
{
	$("#cf").hide();
        $("#chat").fadeOut();
	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];


	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
	 
	var conceptName = $('#wgtc').find(":selected").val();
	toggleDropDown(conceptName);
	$("#wgtc").change(function () 
	{
            var val = $(this).val();
            toggleDropDown(val);
      
        });
	
	$("#input").keypress(function(event) 
	{
		if (event.which == 13) 
		{
			send_chat_msg(event);
		}
	});
	
	$("#submitmsg").click(function(event) 
	{
		send_chat_msg(event);
	});
			
	
	$("#done").click(function(event) 
	{
		event.preventDefault();
		$("#prechat").fadeIn();
		$("#chat").fadeOut();
	});
	$("#chat_btn").click(function(event) 
	{
            alert("Clicked");
		var sep = " ";
		var acd = $( "#wgtc option:selected" ).text();
		agent_id = $( "#tan option:selected" ).text();
		var ban = $( "#ban" ).val();
		var cbr = $( "#tcbr" ).val();
		var text4 = $( "#l1 option:selected" ).text();
		
		var text = agent_id + sep + ban + sep + cbr;

		if(ban.length>8 && $.isNumeric( ban) )
		{
			if(cbr.length>0 && $.isNumeric( cbr))
			{
				if (text4.length > 0)
			    {
			    	$("#prechat").fadeOut();
				$("#chat").fadeIn();
				send_msg(event, text);
			    }
			     else
			    {
			    	 $(".modal-content p").text("Please select a Level 1");
			    	 modal.style.display = "block";
			    	 return false;
			    }
			}
			else
			{
				$(".modal-content p").text("Please enter a Numeric CBR");
				modal.style.display = "block";
				return false;
			}
		}
		else
		{
			$(".modal-content p").text("Please enter a BAN between 9-12 digits");
			modal.style.display = "block";
			return false;
		}
	});
});

function toggleDropDown(val)
{
	  if (val == "lg") 
      {
		  $("#cf").hide();
		  $("#sns").show();
          $("#l1").html("<option value='pc'>Sync No Service</option><option value='ppc'>Package/Profile Change</option>");
      } 
      else if (val == "co") 
      {
          $("#l1").html("<option value='cf'>Cable Failure</option>");
          $("#sns").hide();
          $("#cf").show();
      } 
}

function clearFields()
{
	$('#ban').val('');
	$('#tcbr').val('');
}

function send_chat_msg(event)
{
	var text = $("#input").val();
	var my_msg =  agent_id + " ( " + Date() + " ) " + text;
	var styled_my_msg = "<div class='msgMe'>" + my_msg + "</div>";
	setResponse(styled_my_msg);
	$('#input').val('');
	send_msg(event, text);
}

function send_msg(event, text)
{
	event.preventDefault();
	send(text);
}

function send(text) 
{
	
	$.ajax({
		type: "POST",
		url: baseUrl + "query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
		success: function(data) 
		{
			var json_str = JSON.stringify(data, undefined, 2);
			var json = $.parseJSON(json_str);
			$(json).each(function(i,val)
			{
			    $.each(val,function(k,v)
			    {
			          
			          if (k == 'result')
			          {
			        	  $(v).each(function(i1,val1)
			  			  {
			        		  $.each(val1,function(k1,v1)
			  				  {
			        			  if (k1 == 'fulfillment')
						          {
						        	  $(v1).each(function(i2,val2)
						  			  {
						        		  $.each(val2,function(k2,v2)
						  				  {
						        			  if ( k2 == "speech")
						        			  {
						        				  var bot_msg = "bot123 ( " + Date() + " ) " + v2;
						        				  var styled_bot_msg = "<div class='msgBot'>" + bot_msg + "</div>";
						        				  setResponse(styled_bot_msg); 
						        			  }
						  				  });
						  			  });
						          }
			  				  });
			  			  });
			          }
				});
			});
			
			
		},
		error: function() {
			setResponse("Internal Server Error");
		}
	});
}

function setResponse(val) 
{
	$('#chatbox').append($('<li>').html( val ));
	var objDiv = document.getElementById("chatbox");
	objDiv.scrollTop = objDiv.scrollHeight;
}