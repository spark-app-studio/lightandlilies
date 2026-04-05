// Light & Lilies HTML email templates
// Uses inline styles for email client compatibility

const COLORS = {
  cream: "#FDF8F0",
  purpleDark: "#2D1B4E",
  purple: "#6B4C8A",
  purpleLight: "#E8D5F5",
  greenLight: "#D4E8D0",
  green: "#7BA67D",
  textPrimary: "#2D1B4E",
  textSecondary: "#5C4A6E",
};

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${COLORS.cream};font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.cream};">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background-color:${COLORS.purpleDark};padding:24px 32px;text-align:center;">
          <h1 style="margin:0;color:${COLORS.cream};font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;letter-spacing:2px;">Light &amp; Lilies</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="background-color:#ffffff;padding:40px 32px;color:${COLORS.textPrimary};font-size:15px;line-height:1.7;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background-color:${COLORS.purpleLight};padding:24px 32px;text-align:center;">
          <p style="margin:0 0 8px;color:${COLORS.textSecondary};font-size:13px;">Light &amp; Lilies</p>
          <p style="margin:0;color:${COLORS.textSecondary};font-size:11px;opacity:0.7;">Operated by Spark App Studios LLC</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h2 style="margin:0 0 16px;color:${COLORS.purpleDark};font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:normal;letter-spacing:1px;">${text}</h2>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;color:${COLORS.textSecondary};font-size:15px;line-height:1.7;">${text}</p>`;
}

function button(url: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="background-color:${COLORS.purpleDark};border-radius:2px;">
    <a href="${url}" style="display:inline-block;padding:12px 28px;color:${COLORS.cream};font-size:14px;text-decoration:none;letter-spacing:1px;">${label}</a>
  </td></tr></table>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${COLORS.purpleLight};margin:24px 0;" />`;
}

function detail(label: string, value: string): string {
  return `<p style="margin:0 0 8px;font-size:14px;"><strong style="color:${COLORS.textPrimary};">${label}:</strong> <span style="color:${COLORS.textSecondary};">${value}</span></p>`;
}

function signoff(): string {
  return `<p style="margin:24px 0 0;color:${COLORS.textSecondary};font-size:14px;">Warm regards,<br><span style="color:${COLORS.purpleDark};">Light &amp; Lilies</span></p>`;
}

// --- Public templates ---

export function welcomeCustomer(name: string, collections: { name: string; subtitle: string }[], agreedDate: string): string {
  const collectionList = collections.map((c) =>
    `<li style="margin:0 0 8px;color:${COLORS.textSecondary};font-size:14px;"><strong style="color:${COLORS.textPrimary};">${c.name}</strong> — ${c.subtitle}</li>`
  ).join("");

  return layout(`
    ${paragraph(`Dear ${name},`)}
    ${paragraph("Thank you for joining Light &amp; Lilies. You are now subscribed to receive updates when new pieces are added to your selected collections.")}
    ${heading("Your Collections")}
    <ul style="margin:0 0 16px;padding-left:20px;">${collectionList}</ul>
    ${divider()}
    ${paragraph(`You agreed to receive email updates on ${agreedDate}.`)}
    ${signoff()}
  `);
}

export function artistRegistrationConfirmation(name: string, medium: string, description: string, agreedDate: string): string {
  return layout(`
    ${paragraph(`Dear ${name},`)}
    ${paragraph("Thank you for registering with Light &amp; Lilies. We have received your submission and will review it shortly.")}
    ${heading("What You Agreed To")}
    ${detail("Terms of Service", `Accepted on ${agreedDate}`)}
    ${detail("Consignment Fee (30%)", `Accepted on ${agreedDate}`)}
    ${divider()}
    ${heading("Your Submission")}
    ${detail("Medium", medium)}
    ${paragraph(description)}
    ${divider()}
    ${paragraph("We will get back to you within 5 business days. If you have any questions, please reply to this email.")}
    ${signoff()}
  `);
}

export function artistRegistrationNotify(name: string, email: string, phone: string, website: string, medium: string, description: string, agreedDate: string): string {
  return layout(`
    ${heading("New Artist Registration")}
    ${detail("Name", name)}
    ${detail("Email", email)}
    ${detail("Phone", phone)}
    ${detail("Website", website)}
    ${divider()}
    ${detail("Medium", medium)}
    ${paragraph(description)}
    ${divider()}
    ${detail("Terms of Service", `Accepted on ${agreedDate}`)}
    ${detail("Consignment Fee (30%)", `Accepted on ${agreedDate}`)}
  `);
}

export function newMemberNotify(name: string, email: string, collections: string): string {
  return layout(`
    ${heading("New Member")}
    ${detail("Name", name)}
    ${detail("Email", email)}
    ${detail("Collections", collections)}
  `);
}

export function passwordReset(name: string, resetUrl: string): string {
  return layout(`
    ${paragraph(`Dear ${name},`)}
    ${paragraph("A password reset was requested for your Light &amp; Lilies account.")}
    ${button(resetUrl, "Reset Password")}
    ${paragraph("This link expires in 15 minutes.")}
    ${paragraph("If you did not request this, you can safely ignore this email.")}
    ${signoff()}
  `);
}

export function adminPasswordReset(email: string, resetUrl: string): string {
  return layout(`
    ${paragraph(`A password reset was requested for the admin account: <strong>${email}</strong>.`)}
    ${button(resetUrl, "Reset Password")}
    ${paragraph("This link expires in 15 minutes.")}
    ${paragraph("If you did not request this, you can safely ignore this email.")}
  `);
}

export function newArtworkNotification(subscriberName: string, artworkTitle: string, medium: string, description: string, imagePath: string, buyUrl: string, collectionName: string, siteUrl: string): string {
  const imageHtml = imagePath
    ? `<img src="${imagePath}" alt="${artworkTitle}" style="max-width:100%;border-radius:2px;margin-bottom:16px;" />`
    : "";
  const buyHtml = buyUrl
    ? button(buyUrl, "View &amp; Purchase")
    : "";

  return layout(`
    ${paragraph(`Dear ${subscriberName},`)}
    ${paragraph(`A new piece has been added to <strong>${collectionName}</strong>, a collection you follow.`)}
    ${divider()}
    ${imageHtml}
    ${heading(artworkTitle)}
    ${medium ? paragraph(`<em>${medium}</em>`) : ""}
    ${description ? paragraph(description) : ""}
    ${buyHtml}
    ${divider()}
    ${button(siteUrl, "Visit Light &amp; Lilies")}
    <p style="margin:24px 0 0;color:#999;font-size:11px;">You are receiving this because you subscribed to the ${collectionName} collection.</p>
  `);
}

export function emailSubscriberNotify(email: string): string {
  return layout(`
    ${heading("New Email Subscriber")}
    ${paragraph(`<strong>${email}</strong> has signed up.`)}
  `);
}
