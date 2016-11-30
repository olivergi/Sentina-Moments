
var clicks = 0;
var firstClickDate=0;

function tripleclick(){
	if(event.button==0){
		if(new Date() - firstClickDate < 500){
			clicks++;
		}
		else{
			clicks=1;	
		}
	}
	if(clicks==3){
		alert('tripleclick');
		clicks=1;
	}
	firstClickDate = new Date();
}