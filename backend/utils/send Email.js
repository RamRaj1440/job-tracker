const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

// ─── EMAIL TEMPLATES ──────────────────────────────────

const applicationAddedTemplate = (userName, company, role, status, jobLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">

    <!-- Header -->
    <div style="background: #0A66C2; padding: 28px 32px;">
      <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 800;">
        💼 JobTracker
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <h2 style="color: #1a1a2e; font-size: 22px; margin: 0 0 8px;">
        Application Tracked! ✅
      </h2>
      <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
        Hi ${userName}, your application has been added to your tracker.
      </p>

      <!-- Job Card -->
      <div style="background: #F8FAFC; border-radius: 10px; padding: 20px; border: 1px solid #E2E8F0; margin-bottom: 24px;">
        <div style="margin-bottom: 12px;">
          <span style="font-size: 12px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Company</span>
          <p style="font-size: 18px; font-weight: 800; color: #1a1a2e; margin: 4px 0 0;">${company}</p>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="font-size: 12px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Role</span>
          <p style="font-size: 16px; font-weight: 600; color: #333; margin: 4px 0 0;">${role}</p>
        </div>
        <div>
          <span style="font-size: 12px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Status</span>
          <p style="margin: 4px 0 0;">
            <span style="background: #EFF6FF; color: #0A66C2; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 700;">
              ${status}
            </span>
          </p>
        </div>
      </div>

      ${jobLink ? `
        <a href="${jobLink}" style="display: inline-block; margin-bottom: 24px; color: #0A66C2; font-size: 14px; font-weight: 600;">
          🔗 View Job Posting →
        </a>
      ` : ''}

      <p style="color: #666; font-size: 14px; line-height: 1.6;">
        💡 <strong>Pro tip:</strong> Use our AI Tools to generate a personalized cover letter for this role!
      </p>

      <a href="${process.env.FRONTEND_URL}/dashboard"
         style="display: inline-block; margin-top: 20px; padding: 12px 24px;
                background: #0A66C2; color: #fff; border-radius: 8px;
                text-decoration: none; font-weight: 700; font-size: 15px;">
        View Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; padding: 16px 32px; border-top: 1px solid #E2E8F0;">
      <p style="color: #94A3B8; font-size: 12px; margin: 0;">
        © 2026 JobTracker by RamRaj Devulapalli · You're receiving this because you use JobTracker.
      </p>
    </div>
  </div>
`;

const statusChangedTemplate = (userName, company, role, oldStatus, newStatus) => {
  const statusColors = {
    Applied: '#3B82F6',
    'Written Test': '#F59E0B',
    Interview: '#8B5CF6',
    Offered: '#10B981',
    Rejected: '#EF4444',
  };

  const statusMessages = {
    'Written Test': `Great progress! Prepare well for the written test at ${company}.`,
    Interview: `Exciting news! You have an interview with ${company}. Use our AI Interview Prep tool to get ready!`,
    Offered: `🎉 Congratulations! You received an offer from ${company}! You're one step closer to your dream job!`,
    Rejected: `Don't give up! Every rejection is a step closer to the right opportunity. Keep applying!`,
    Applied: `Application status updated to Applied for ${company}.`,
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">

      <!-- Header -->
      <div style="background: ${statusColors[newStatus] || '#0A66C2'}; padding: 28px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 800;">💼 JobTracker</h1>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <h2 style="color: #1a1a2e; font-size: 22px; margin: 0 0 8px;">
          Status Updated!
        </h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Hi ${userName}, your application status has changed.
        </p>

        <!-- Company Info -->
        <div style="background: #F8FAFC; border-radius: 10px; padding: 20px; border: 1px solid #E2E8F0; margin-bottom: 20px;">
          <p style="font-size: 18px; font-weight: 800; color: #1a1a2e; margin: 0 0 4px;">${company}</p>
          <p style="font-size: 14px; color: #666; margin: 0;">${role}</p>
        </div>

        <!-- Status Change Arrow -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding: 16px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
          <span style="background: #E2E8F0; color: #64748B; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;">
            ${oldStatus}
          </span>
          <span style="font-size: 20px; color: #94A3B8;">→</span>
          <span style="background: ${statusColors[newStatus]}20; color: ${statusColors[newStatus]}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1px solid ${statusColors[newStatus]}40;">
            ${newStatus}
          </span>
        </div>

        <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          ${statusMessages[newStatus] || ''}
        </p>

        <a href="${process.env.FRONTEND_URL}/dashboard"
           style="display: inline-block; padding: 12px 24px;
                  background: ${statusColors[newStatus] || '#0A66C2'}; color: #fff;
                  border-radius: 8px; text-decoration: none;
                  font-weight: 700; font-size: 15px;">
          View Dashboard →
        </a>
      </div>

      <!-- Footer -->
      <div style="background: #F8FAFC; padding: 16px 32px; border-top: 1px solid #E2E8F0;">
        <p style="color: #94A3B8; font-size: 12px; margin: 0;">
          © 2026 JobTracker by RamRaj Devulapalli
        </p>
      </div>
    </div>
  `;
};

const weeklySummaryTemplate = (userName, stats, topCompany) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">

    <!-- Header -->
    <div style="background: #0A66C2; padding: 28px 32px;">
      <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 800;">💼 JobTracker</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">Your Weekly Summary</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <h2 style="color: #1a1a2e; font-size: 22px; margin: 0 0 8px;">
        Week in Review 
      </h2>
      <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
        Hi ${userName}, here's how your job search is going this week.
      </p>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px;">
        ${[
    { label: 'Total Applied', value: stats.total, color: '#0A66C2' },
    { label: 'Interviews', value: stats.interviews, color: '#8B5CF6' },
    { label: 'Offers', value: stats.offers, color: '#10B981' },
    { label: 'Rejected', value: stats.rejected, color: '#EF4444' },
  ].map(stat => `
          <div style="background: #F8FAFC; border-radius: 10px; padding: 16px; border: 1px solid #E2E8F0; text-align: center;">
            <p style="font-size: 28px; font-weight: 800; color: ${stat.color}; margin: 0 0 4px;">${stat.value}</p>
            <p style="font-size: 12px; color: #94A3B8; margin: 0; font-weight: 600;">${stat.label}</p>
          </div>
        `).join('')}
      </div>

      ${topCompany ? `
        <div style="background: #EFF6FF; border-radius: 10px; padding: 16px; border: 1px solid #BFDBFE; margin-bottom: 24px;">
          <p style="color: #0A66C2; font-size: 13px; font-weight: 700; margin: 0 0 4px;">🏢 Most Applied To</p>
          <p style="color: #1a1a2e; font-size: 16px; font-weight: 700; margin: 0;">${topCompany}</p>
        </div>
      ` : ''}

      <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        ${stats.total >= 5
    ? `🎉 Great week! You hit your goal of 5+ applications. Keep the momentum going!`
    : `💪 You need ${5 - stats.total} more application${5 - stats.total !== 1 ? 's' : ''} to hit your weekly goal of 5. You've got this!`
  }
      </p>

      <a href="${process.env.FRONTEND_URL}/dashboard"
         style="display: inline-block; padding: 12px 24px;
                background: #0A66C2; color: #fff; border-radius: 8px;
                text-decoration: none; font-weight: 700; font-size: 15px;">
        View Full Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; padding: 16px 32px; border-top: 1px solid #E2E8F0;">
      <p style="color: #94A3B8; font-size: 12px; margin: 0;">
        © 2026 JobTracker · Weekly summaries are sent every Sunday.
      </p>
    </div>
  </div>
`;

// ─── SEND FUNCTIONS ───────────────────────────────────

const sendApplicationAddedEmail = async (userEmail, userName, company, role, status, jobLink) => {
  try {
    await transporter.sendMail({
      from: `"JobTracker" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: ` Application tracked — ${role} at ${company}`,
      html: applicationAddedTemplate(userName, company, role, status, jobLink),
    });
    console.log(`Application added email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email error (applicationAdded):', error.message);
  }
};

const sendStatusChangedEmail = async (userEmail, userName, company, role, oldStatus, newStatus) => {
  try {
    await transporter.sendMail({
      from: `"JobTracker" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: ` Status update — ${company} application moved to ${newStatus}`,
      html: statusChangedTemplate(userName, company, role, oldStatus, newStatus),
    });
    console.log(`Status changed email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email error (statusChanged):', error.message);
  }
};

const sendWeeklySummaryEmail = async (userEmail, userName, stats, topCompany) => {
  try {
    await transporter.sendMail({
      from: `"JobTracker" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: ` Your weekly job search summary — JobTracker`,
      html: weeklySummaryTemplate(userName, stats, topCompany),
    });
    console.log(`Weekly summary email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email error (weeklySummary):', error.message);
  }
}; z

module.exports = {
  sendApplicationAddedEmail,
  sendStatusChangedEmail,
  sendWeeklySummaryEmail,
};