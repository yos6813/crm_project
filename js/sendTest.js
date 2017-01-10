var notifyZapierOfJobPost = function(snapshot){
	
  var job = snapshot.val();
  var key = snapshot.key;

  var email = job.userEmail;
  if(job.sent_to_zapier) return; //ignore if already sent
  if(!email) return; //ignore if email is blank

  var zapierNewJobPost = 'https://hooks.zapier.com/hooks/catch/xxx/xxx/';
  
  request({
    url: zapierNewJobPost,
    method: "POST",
    json: job
  });
  
  firebase.database().ref('qnaWrite/'+ key +'/sent_to_zapier').set(true);
  
}

var jobsRef = firebase.database().ref('qnaWrite');
jobsRef.orderByChild('sent_to_zapier').equalTo(null).on('child_changed', notifyZapierOfJobPost);