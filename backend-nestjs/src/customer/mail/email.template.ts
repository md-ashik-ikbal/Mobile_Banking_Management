export const Email_Template = async (otp: string) => {
    return (`
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; padding: 10px; background-color: #4CAF50; color: white; border-radius: 8px 8px 0 0;">
                <h2>OTP Verification</h2>
                </div>
                <div style="padding: 20px;">
                <p>Dear User,</p>
                <p>Your One-Time Password (OTP) is:</p>
                <div style="font-size: 36px; font-weight: bold; text-align: center; color: #4CAF50; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP will expire in 10 minutes. Please use it to complete your verification.</p>
                </div>
                <div style="font-size: 14px; color: #777; text-align: center; padding: 10px; border-top: 1px solid #f1f1f1;">
                <p>If you did not request this OTP, please ignore this email.</p>
                </div>
            </div>
            </body>
        </html>
    `)
}