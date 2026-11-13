const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderEmail = ({preheader, heading, intro, content, footer}) => `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f3f5;font-family:Arial,Helvetica,sans-serif;color:#161d29;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f3f5;">
        <tr>
            <td align="center" style="padding:36px 16px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
                    <tr>
                        <td style="padding:22px 30px;background-color:#161d29;border-radius:12px 12px 0 0;">
                            <span style="font-size:21px;font-weight:700;letter-spacing:0.2px;color:#ffffff;">Study<span style="color:#ffd60a;">Notion</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 30px;background-color:#ffffff;">
                            <h1 style="margin:0 0 14px;font-size:25px;line-height:1.3;color:#161d29;">${escapeHtml(heading)}</h1>
                            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#424854;">${intro}</p>
                            ${content}
                            <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#424854;">${footer}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 30px;background-color:#f8f9fb;border-radius:0 0 12px 12px;">
                            <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">You received this message because of activity related to your StudyNotion account or a message sent through our website.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

exports.verificationOtp = (otp) => renderEmail({
    preheader: 'Your StudyNotion email verification code',
    heading: 'Verify your email',
    intro: 'You’re one step away from starting your learning journey. Enter this verification code in StudyNotion to finish creating your account:',
    content: `<div style="margin:0;padding:20px;text-align:center;background-color:#fff9db;border:1px solid #ffe58f;border-radius:10px;">
        <span style="font-size:32px;font-weight:700;letter-spacing:10px;color:#161d29;">${escapeHtml(otp)}</span>
    </div>
    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">This code expires in 5 minutes. For your security, don’t share it with anyone.</p>`,
    footer: 'If you didn’t request this code, you can safely ignore this email.',
});

exports.passwordReset = (url) => {
    const safeUrl = escapeHtml(url);
    return renderEmail({
        preheader: 'Reset your StudyNotion password',
        heading: 'Password reset requested',
        intro: 'We received a request to reset the password for your StudyNotion account. Use the button below to choose a new password.',
        content: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0;">
            <tr>
                <td align="center" style="border-radius:8px;background-color:#ffd60a;">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 24px;color:#161d29;text-decoration:none;font-size:15px;font-weight:700;">Reset my password</a>
                </td>
            </tr>
        </table>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">This link expires in 5 minutes and can only be used once. If the button doesn’t work, copy this link into your browser:</p>
        <p style="margin:10px 0 0;word-break:break-all;font-size:13px;line-height:1.6;"><a href="${safeUrl}" style="color:#2563eb;">${safeUrl}</a></p>`,
        footer: 'If you didn’t request a password reset, ignore this email. Your password won’t change unless you use the link above.',
    });
};

exports.contactMessage = ({name, email, phone, message}) => renderEmail({
    preheader: `New StudyNotion contact message from ${name}`,
    heading: 'New contact message',
    intro: `You’ve received a message through the StudyNotion website from <strong>${escapeHtml(name)}</strong>.`,
    content: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;background-color:#f8f9fb;border-radius:8px;">
        <tr><td style="padding:18px 20px;font-size:14px;line-height:1.8;color:#424854;">
            <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;">${escapeHtml(email)}</a></p>
            <p style="margin:0 0 14px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            <p style="margin:0 0 6px;"><strong>Message</strong></p>
            <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
        </td></tr>
    </table>`,
    footer: 'You can reply directly to this email to respond to the sender.',
});
