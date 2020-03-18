var admin = require("firebase-admin");
var wpi = require('node-wiring-pi');
wpi.setup('wpi');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

//-----Fix Error---------------------------
const settings = { timestampsInSnapshots: true};
admin.firestore().settings(settings);
//-----Fix Error---------------------------
var db = admin.firestore();

///door in 
//lock out


console.log("Controlling RPi pins from Cloud(firebase)");    

console.log(" Rpi GPIO_1 i.e physical 12 number pin is for Comp 1 ");
console.log(" Rpi GPIO_2 i.e physical 13 number pin is for Comp 2 ");
console.log(" Rpi GPIO_3 i.e physical 03 number pin is for Comp 3 ");
console.log(" Rpi GPIO_7 i.e physical 07 number pin is for Comp 4 ");

var pinNum_GPIO_1_Phy_12 = 1;//gpio 1 Phy num 11 comp1
var pinNum_GPIO_2_Phy_13 = 2;//gpio 2 Phy num 13 comp2
var pinNum_GPIO_3_Phy_15 = 3;//gpio 3 Phy num 15 comp3
var pinNum_GPIO_7_Phy_07 = 7;//gpio 7 Phy num 07 comp4

wpi.pinMode(pinNum_GPIO_1_Phy_12, wpi.OUTPUT);
wpi.pinMode(pinNum_GPIO_2_Phy_13, wpi.OUTPUT);
wpi.pinMode(pinNum_GPIO_3_Phy_15, wpi.OUTPUT);
wpi.pinMode(pinNum_GPIO_7_Phy_07, wpi.OUTPUT);


 
let observerComp1 = db.collection('compartment').where('compartmentId', '==', 'comp1')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {     
      if (change.type === 'modified') {
        console.log(' comp1 locked:', change.doc.data().isLocked);		
		if(change.doc.data().isLocked){
			wpi.digitalWrite(pinNum_GPIO_1_Phy_12, wpi.LOW);
		}else{
			wpi.digitalWrite(pinNum_GPIO_1_Phy_12, wpi.HIGH);
		}		
      }
     
    });
  });



let observerComp2 = db.collection('compartment').where('compartmentId', '==', 'comp2')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {     
      if (change.type === 'modified') {
			console.log(' comp2 locked:', change.doc.data().isLocked);		
			if(change.doc.data().isLocked){
				wpi.digitalWrite(pinNum_GPIO_2_Phy_13, wpi.LOW);
			}else{
				wpi.digitalWrite(pinNum_GPIO_2_Phy_13, wpi.HIGH);
			}		
      }     
    });
  });

let observerComp3 = db.collection('compartment').where('compartmentId', '==', 'comp3')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
     
      if (change.type === 'modified') {
			console.log(' comp3 locked:', change.doc.data().isLocked);
			if(change.doc.data().isLocked){
				 wpi.digitalWrite(pinNum_GPIO_3_Phy_15, wpi.LOW);
			}else{
				wpi.digitalWrite(pinNum_GPIO_3_Phy_15, wpi.HIGH);
			}			
      }     
    });
  });
