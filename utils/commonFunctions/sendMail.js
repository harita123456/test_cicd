var nodemailer = require("nodemailer");
const {
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
} = require("../../constants/env");

const sendOtpCode = async (data) => {
  var transporter = nodemailer.createTransport({
    host: "sg2plzcpnl490081.prod.sin2.secureserver.net", //smtp.gmail.com
    port: 465, //587
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  var sendPwd = {
    from: MAIL_FROM_ADDRESS,
    to: data.email_address,
    subject: "Common Structure",
    html: `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title></title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0;font-family: 'Poppins', sans-serif;">
      <div style="background-color: #FCFEFF; max-width: 640px; margin: 0 auto; padding: 40px; border: 2px solid #00aeef;">
        <div style="text-align: center;">
          <img src="image_url" alt="Logo Image" style="max-width: 100%;" />
        </div>
        <p style="font-weight: 600;font-size: 20px;line-height: 30px;color: #0056A7; margin: 70px 0 10px 0;">Hello ${data.email_address},</p>
        <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;margin: 0 0 0 0;max-width: 415px;">We’ve received a request to reset your Password. If you didn’t make the request, just ignore email.</p>
        <h2 style="margin-bottom: 40px;margin-top: 30px; font-size: 25px;font-weight: 500;line-height: 38px;color: #0C3B67; text-align:center;">Your Verification code is<br><span style="display:block;margin-top: 20px;font-weight: 700;font-size: 54px;color: #0056A7;">${data.otp}</span></h2>
        <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;margin: 0 0 0 0;">Please do not share your code with anyone else.</p>
        <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;max-width: 415px; margin: 15px 0 0; ">If you have any questions or trouble logging on please contact <a href="mailto:xyz@gmail.com" style="font-weight:600;color: #0056A7;">xyz@gmail.com</a></p>	
        <div style="margin-top: 30px;font-weight: 500;font-size: 15px;color: #0C3B67; ">
         <b>Thank You,<br> xyz </b> 
        </div>
      </div>
    </body>
    </html>`,
  };

  return await transporter.sendMail(sendPwd);
};

const sendPassword = async (data) => {
  var transporter = nodemailer.createTransport({
    host: "sg2plzcpnl490081.prod.sin2.secureserver.net", //smtp.gmail.com
    port: 465, //587
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  var sendPwd = {
    from: MAIL_FROM_ADDRESS,
    to: data.email,
    subject: "Common Structure",
    html: `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title></title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0;font-family: 'Poppins', sans-serif;">
      <div style="background-color: #FCFEFF; max-width: 640px; margin: 0 auto; padding: 40px; border: 2px solid #00aeef;">
        <div style="text-align: center;">
          <img src="image_url" alt="Logo Image" style="max-width: 100%;" />
        </div>
        <p style="font-weight: 600;font-size: 20px;line-height: 30px;color: #0056A7; margin: 70px 0 10px 0;">Hello ${data.email},</p>
        <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;margin: 0 0 0 0;max-width: 415px;">We’ve received a request to reset your Password. If you didn’t make the request, just ignore email.</p>
        <h2 style="margin-bottom: 40px;margin-top: 30px; font-size: 25px;font-weight: 500;line-height: 38px;color: #0C3B67; text-align:center;">Your New Password is<br><span style="display:block;margin-top: 20px;font-weight: 700;font-size: 54px;color: #0056A7;">${data.password}</span></h2>
        <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;margin: 0 0 0 0;">Please do not share your code with anyone else.</p>
        <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;max-width: 415px; margin: 15px 0 0; ">If you have any questions or trouble logging on please contact <a href="mailto:xyz@gmail.com" style="font-weight:600;color: #0056A7;">xyz@gmail.com</a></p>	
        <div style="margin-top: 30px;font-weight: 500;font-size: 15px;color: #0C3B67; ">
         <b>Thank You,<br> xyz </b> 
        </div>
      </div>
    </body>
    </html>`,
  };

  return await transporter.sendMail(sendPwd);
};

const sendMailForPwd = async (data) => {
  var transporter = nodemailer.createTransport({
    host: "sg2plzcpnl490081.prod.sin2.secureserver.net", //smtp.gmail.com
    port: 465, //587
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  var sendPwd = {
    from: MAIL_FROM_ADDRESS,
    to: data.email,
    subject: "Common Structure",
    html: `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,700&display=swap" rel="stylesheet">
  </head>
  <body style="margin: 0;font-family: 'Poppins', sans-serif;">
    <div style="background-color: #FCFEFF; max-width: 640px; margin: 0 auto; padding: 40px; border: 2px solid #00aeef;">
      <div style="text-align: center;">
        <img src="image_url" alt="Logo Image" style="max-width: 100%;" />
      </div>
      <p style="font-weight: 600;font-size: 20px;line-height: 30px;color: #0056A7; margin: 70px 0 10px 0;">Hello ${data.email},</p>
      <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;margin: 0 0 0 0;max-width: 415px;">We’ve received a request to reset your Password. If you didn't make the request, just ignore email.</p>
      <h2 style="margin-bottom: 40px;margin-top: 30px; font-size: 25px;font-weight: 500;line-height: 38px;color: #0C3B67; text-align:center;"><a id="click_iframe" href="http://192.168.29.234:2002/reset_password/${data.user_id}">Click here</a> to reset your password<br></h2>
      <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;max-width: 415px; margin: 15px 0 0; ">If you have any questions or trouble logging on please contact <a href="mailto:xyz@gmail.com" style="font-weight:600;color: #0056A7;">xyz@gmail.com</a></p>	
      <div style="margin-top: 30px;font-weight: 500;font-size: 15px;color: #0C3B67; ">
       <b>Thank You,<br> xyz </b> 
      </div>
    </div>
    
    </script>
  </body>
  </html>`,
  };

  return await transporter.sendMail(sendPwd);
};

const welcomeMail = async (data) => {
  var transporter = nodemailer.createTransport({
    host: "sg2plzcpnl490081.prod.sin2.secureserver.net", //smtp.gmail.com
    port: 465, //587
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  var registerWelcomeMail = {
    from: MAIL_FROM_ADDRESS,
    to: data.email_address,
    subject: "Common Structure -- Welcome Mail",
    html: `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,700&display=swap" rel="stylesheet">
  </head>
  <body style="margin: 0;font-family: 'Poppins', sans-serif;">
    <div style="background-color: #FCFEFF; max-width: 640px; margin: 0 auto; padding: 40px; border: 2px solid #00aeef;">
      <div style="text-align: center;">
        <img src="image_url" alt="Logo Image" style="max-width: 100%;" />
      </div>
      <p style="font-weight: 600;font-size: 20px;line-height: 30px;color: #0056A7; margin: 70px 0 10px 0;">Hello ${data.user_name},</p>
      <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;margin: 0 0 0 0;max-width: 415px;">Welcome </p>
      <h2 style="margin-bottom: 40px;margin-top: 30px; font-size: 25px;font-weight: 500;line-height: 38px;color: #0C3B67; text-align:center;"> Thank You for join our team <br></h2>
      <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #0C3B67;max-width: 415px; margin: 15px 0 0; ">If you have any questions please contact <a href="mailto:xyz@gmail.com" style="font-weight:600;color: #0056A7;">xyz@gmail.com</a></p>	
      <div style="margin-top: 30px;font-weight: 500;font-size: 15px;color: #0C3B67; ">
       <b>Thank You,<br> xyz </b> 
      </div>
    </div>
    
    </script>
  </body>
  </html>`,
  };

  return await transporter.sendMail(registerWelcomeMail);
};

module.exports = { sendOtpCode, sendPassword, sendMailForPwd, welcomeMail };
