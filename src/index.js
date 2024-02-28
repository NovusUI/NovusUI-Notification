const express = require("express")
const authMiddleware = require("./middleware/authMiddleWare")
const cors = require("cors")
const admin = require("../firebase-config")

require("dotenv").config()
const port = process.env.PORT ||10000

const app = express()

const allowedOrigins = ["http://localhost:3000","https://mappool-9a59c.firebaseapp.com","https://mappool-9a59c.web.app","https://mappool-9a59c--test-channe-id-x1omb20t.web.app"];

const corsOptions =  {
    origin:allowedOrigins,

}
app.use(cors(corsOptions))

app.use(authMiddleware)
app.use(express.json())

app.post('/api/v1/test-notification',(req,res)=>{
  
    const registrationToken = 'dsDEYVWEd2zRXiOTd9Kf-5:APA91bGNv1TFkbKMPwa9HFelZ4CEGMidqtF7Ts-X1pmXjE557TB4YOdXraHUH8ayjSNEkcA1QWIvSWliskD3uKzZjxKnd2ehYI27njpw2vK6sFMi-JWshZrMRb2GOhmTgi9QW88RLIHh';

const message = {
  data: {
    title: 'Your Notification Title',
    body: 'Your Notification Body',
  },
  notification: {
    title: 'Your Notification Title',
    body: 'Your Notification Body',
  },

  token: registrationToken,
};

 admin.messaging().send(message).then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });



})


app.post('/api/v1/registertotopic',(req,res)=>{
  const { registrationToken, topic } = req.body;

  // Subscribe the device to the FCM topic (group ID)
  admin.messaging().subscribeToTopic(registrationToken, topic)
    .then(() => {
      console.log("subscribed")
      res.status(200).json({ success: true });
      
    })
    .catch((error) => {
      console.error('Error subscribing to topic:', error);
      res.status(500).json({ success: false, error: error.message });
    });           
})

app.post("/api/v1/unregistertotopic",(req,res)=>{

  const { registrationToken, topic } = req.body;
  admin.messaging().unsubscribeFromTopic(registrationToken, topic)
  .then(() => {
    console.log(`Successfully unsubscribed ${registrationToken} from topic ${topic}`);
    res.status(200).json({ success: true });
  })
  .catch((error) => {
    console.error(`Error unsubscribing ${registrationToken} from topic ${topic}:`, error);
    res.status(500).json({ success: false, error: error.message });
  });
})
app.post("/api/v1/sendmsgtotopic",(req,res)=>{
  const { topic, notification,data } = req.body;
   
  console.log(notification)
  const message = {
    
    notification: {
      "title": notification.title,
      "body": notification.body,
      "click_action": "OPEN_URL",
      "data": {url:"https://youtube.com"},
    },
    topic,  // Use the group ID as the FCM topic
  };

  // Send the message to the FCM topic (group ID)
  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent group message:', response);
      res.status(200).json({ success: true, response });
    })
    .catch((error) => {
      console.error('Error sending group message:', error);
      res.status(500).json({ success: false, error: error.message });
    });
})
app.post("/api/v1/sendmsgtoregtoken",(req,res)=>{
   const {registrationToken, notification,data} = req.body
   
  //  isTokenValid(registrationToken)
   const message = {
    data: {
      title: 'Your Notification Title',
      body: 'Your Notification Body',
    },
    notification: {
      title: notification.title,
      body:notification.body,
    },
    token: registrationToken,
  };
  
   admin.messaging().send(message).then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).json({success:true})
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
})



app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})


const isTokenValid = (registrationToken) =>{
  
  admin.messaging().checkRegistrationToken(registrationToken)
  .then((response) => {
    // Token is valid
    console.log('Registration token is valid:', response.result[0].valid);
  })
  .catch((error) => {
    // Token is invalid
    console.error('Error checking registration token:', error);
  });

}