const express = require("express")
const authMiddleware = require("./middleware/authMiddleWare")
const cors = require("cors")
const admin = require("../firebase-config")

require("dotenv").config()
const port = process.env.PORT ||10000

const app = express()

const allowedOrigins = ["http://localhost:3000","https://mappool-9a59c.firebaseapp.com","https://mappool-9a59c.web.app"];

const corsOptions =  {
    origin:allowedOrigins,

}
app.use(cors(corsOptions))

app.use(authMiddleware)
app.use(express.json())

app.post('/api/v1/test-notification',(req,res)=>{
    const registrationToken = 'cbLYedbNe_NWegt-Rv-9RX:APA91bHQrETTENLHbL4hTH33PxA6aCt4iC1B8G1lYQsh8ltlr71O2nQlbmsYGO1VZtYdnDmnX1bTMQM9tQ8gNRCsPcR8REwa-lRst8_hGwuw8lvEuI7zBbfCPIMd73n9W2C22lgNA7wc';

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


app.post("api/v1/registertogroup",(req,res)=>{

})

app.post("api/v1/unregistertogroup",(req,res)=>{
    
})
app.post("api/v1/sendmsgtogroup",(req,res)=>{
    
})
app.post("api/v1/sendmsgtoregtoken",(req,res)=>{
    
})



app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})