// import { createTransport } from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const sendMail = async(email,subject,data) => {
//     const transport = createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         auth: {
//             user: process.env.Gmail,
//             pass: process.env.Password,
//         },
//     });

//     console.log('Gmail:', process.env.Gmail);
//     console.log('Password:', process.env.Password);


//     const htmldata = `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>OTP Verification</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//         }
//         .container {
//             background-color: #fff;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//             text-align: center;
//         }
//         h1 {
//             color: red;
//         }
//         p {
//             margin-bottom: 20px;
//             color: #666;
//         }
//         .otp {
//             font-size: 36px;
//             color: #7b68ee; /* Purple text */
//             margin-bottom: 30px;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <h1>OTP Verification</h1>
//         <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
//         <p class="otp">${data.otp}</p> 
//     </div>
// </body>
// </html>
// `;

//     await transport.sendMail({
//         from:process.env.Gmail,
//         to:email,
//         subject:subject,
//         html:htmldata,
//     });
// }

// export default sendMail;

import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, subject, data) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.Gmail,
            pass: process.env.Password,
        },
    });

    // Debugging logs
    console.log('Gmail:', process.env.Gmail);
    console.log('Password:', process.env.Password);
    console.log('To:',email);

    const htmldata = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name}, your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p>
    </div>
</body>
</html>
`;

    await transport.sendMail({
        from:process.env.Gmail,
        to:email,
        subject:"E-Learning",
        html:htmldata,
    });
};

export default sendMail;