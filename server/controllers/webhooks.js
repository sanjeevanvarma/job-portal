//Whenever a user signs up, updates their profile, or deletes their account in Clerk, 
//this webhook automatically updates the corresponding user record in MongoDB. 
//Whenever a user signs up, updates their profile, or deletes their account in Clerk, this webhook automatically updates the corresponding user record in MongoDB.

//Webhook is a class from the Svix SDK that:
//Helps your backend verify that the webhook message actually came from Clerk
//Protects your app from fake requests
//Uses the signing secret (CLERK_WEBHOOK_SECRET) to check the headers and the body


//Webhook from svix ensures that only genuine webhook events sent from Clerk are accepted by your 
//backend. It verifies the message signature before allowing your code to act on it.


import { Webhook } from "svix"
import User from "../models/User.js";

//API Controller function to manage clerk user with database
export const clerkWebhooks = async(req, res) =>{
    try {

        //create a Svix instance with clerk webhook secret 
        const whook = new Webhook (process.env.CLERK_WEBHOOK_SECRET)

        //verifying headers
        //Verify it actually came from Clerk
        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        }) 
        //This secret is used to validate the signature of incoming webhook messages.

        //getting data from request body
        const {data, type} = req.body
        
        //switches cases for different events
        switch (type) {
            case 'user.created': {

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address, 
                    name: data.first_name+" "+data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData);
                res.json({ success: true })
                break;
                
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address, 
                    name: data.first_name+" "+data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({ success: true })
                break;
                
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({ success: true })
                break;
                
            }
            default:
                res.json({ success: false, message: "Invalid event type" });
                break;
        }

        

    } catch (error) {
        console.log(error.message)
        res.json({success:false,message: 'Webhooks Error'})
    }
}


// [Frontend: User signs up]
//      ↓
// [Clerk: Registers user]
//      ↓
// [Clerk ➝ sends webhook]
//      Headers: svix-id, svix-signature...
//      Body: user.created JSON
//      ↓
// [Your Backend: verifies with secret]
//      ↓
// [If valid: adds user to DB]



///////////////////////////////////////////////
// import { Webhook } from "svix";
// import User from "../models/User.js";

// // API Controller function to manage Clerk user data in MongoDB
// export const clerkWebhooks = async (req, res) => {
//     try {
//         console.log(" Incoming webhook request...");

//         // Step 1: Create a Svix Webhook instance with your Clerk secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//         console.log(" Webhook instance created with Clerk secret");

//         // Step 2: Log headers received for debugging
//         console.log(" Received headers:", {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"],
//         });

//         // Step 3: Verify the webhook is truly from Clerk
//         // await whook.verify(JSON.stringify(req.body), {
//         //     "svix-id": req.headers["svix-id"],
//         //     "svix-timestamp": req.headers["svix-timestamp"],
//         //     "svix-signature": req.headers["svix-signature"],
//         // });
//         // console.log(" Webhook signature verified");

//         // Step 4: Get data and event type from the body
//         const { data, type } = req.body;
//         console.log(" Webhook event type:", type);
//         console.log(" Webhook payload:", JSON.stringify(data, null, 2));

//         // Step 5: Handle event based on its type
//         switch (type) {
//             case "user.created": {
//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                     resume: "",
//                 };
//                 await User.create(userData);
//                 console.log(" New user created in DB:", userData);
//                 res.json({ success: true });
//                 break;
//             }

//             case "user.updated": {
//                 const userData = {
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                 };
//                 await User.findByIdAndUpdate(data.id, userData);
//                 console.log(" User updated in DB:", userData);
//                 res.json({ success: true });
//                 break;
//             }

//             case "user.deleted": {
//                 await User.findByIdAndDelete(data.id);
//                 console.log(" User deleted from DB with ID:", data.id);
//                 res.json({ success: true });
//                 break;
//             }

//             default:
//                 console.log(" Unhandled event type:", type);
//                 res.json({ success: false, message: "Invalid event type" });
//                 break;
//         }
//     } catch (error) {
//         console.error(" Error in webhook handler:", error.message);
//         res.json({ success: false, message: "Webhooks Error" });
//     }
// };
