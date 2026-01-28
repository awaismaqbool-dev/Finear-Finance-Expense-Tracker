
const getEmailTemplete = (userName)=>{
    return `<div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; font-family: sans-serif;">
  
  <div style="background-color: #007bff; padding: 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 30px;">Welcome to Finear</h1>
  </div>
  
  <div style="padding: 30px; line-height: 1.6; color: #333333; text-align: left;">
    <p style="font-size: 18px; margin-top: 0;"><b>Hi ${userName},</b></p>
    
    <p>Take control of your finances with <b>Finear</b>. We are excited to help you track, plan, and understand your money in one simple place.</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
      <ul style="margin: 0 0 0 20px; padding: 0;">
        <li style="margin-bottom: 5px;">No confusion.</li>
        <li style="margin-bottom: 5px;">No spreadsheets.</li>
        <li>Just clear financial control.</li>
      </ul>
    </div>
    
    <p>We're glad to have you on board!</p>
  </div>
  
  <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
    &copy; 2026 Finear Project. All rights reserved.
  </div>
</div>`;
};
export default getEmailTemplete;

 export const getOtpTemplete =(otpCode, userName)=>{
  return `
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; font-family: sans-serif;">
      
      <div style="background-color: #007bff; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 30px;">Finear Security</h1>
      </div>
      
      <div style="padding: 30px; line-height: 1.6; color: #333333; text-align: center;">
        <p style="font-size: 18px; text-align: left;"><b>Hi ${userName},</b></p>
        
        <p style="text-align: left;">Verify your identity to keep your Finear account safe. Use the following code to complete your action:</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border: 1px dashed #007bff; border-radius: 8px; display: inline-block;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #007bff;">${otpCode}</span>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: left;">This code is valid for <b>30 minutes</b>. If you did not request this code, please ignore this email or contact support.</p>
        
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; text-align: left; font-size: 13px; color: #d9534f;">
          <b>Warning:</b> Never share this OTP with anyone, including Finear staff.
        </div>
      </div>
      
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        &copy; 2026 Finear Project. All rights reserved.
      </div>
    </div>
  `;
};



