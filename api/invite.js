import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, role, inviterName } = req.body ?? {}

  if (!email || !role) {
    return res.status(400).json({ error: 'Missing email or role' })
  }

  const appUrl    = process.env.APP_URL    || 'http://localhost:5173'
  const fromEmail = process.env.INVITE_FROM_EMAIL || 'Algion KB sample <onboarding@resend.dev>'

  try {
    const { error } = await resend.emails.send({
      from:    fromEmail,
      to:      [email],
      subject: `${inviterName || 'Someone'} invited you to Algion KB sample`,
      html:    buildEmail({ email, role, inviterName, appUrl }),
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send invite email.' })
  }
}

function buildEmail({ email, role, inviterName, appUrl }) {
  const sender = inviterName || 'Someone'

  const roleColors = {
    Admin:  { bg: '#1e1033', border: '#7C5CFC', text: '#C4B8FF' },
    Editor: { bg: '#0d1a2e', border: '#3B82F6', text: '#93C5FD' },
    Viewer: { bg: '#111118', border: '#444466', text: '#aaaacc' },
  }
  const rc = roleColors[role] ?? roleColors.Viewer

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're invited to Algion KB sample</title>
</head>
<body style="margin:0;padding:0;background:#080B14;font-family:'Helvetica Neue',Arial,sans-serif;color:#ECE9FF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080B14;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

          <!-- Logo row -->
          <tr>
            <td style="padding:0 0 28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background:linear-gradient(135deg,#7C5CFC,#4B34C0);border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="font-size:18px;line-height:36px;">💡</span>
                  </td>
                  <td style="padding-left:10px;font-size:16px;font-weight:700;color:#ECE9FF;vertical-align:middle;">
                    Algion KB sample
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;">

              <!-- Card header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(124,92,252,0.18),rgba(75,52,192,0.08));padding:32px;border-bottom:1px solid rgba(255,255,255,0.07);">
                    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#ECE9FF;letter-spacing:-0.02em;">
                      You're invited!
                    </p>
                    <p style="margin:0;font-size:14px;color:rgba(236,233,255,0.55);line-height:1.5;">
                      <strong style="color:rgba(236,233,255,0.85);">${sender}</strong> has invited you to join their Algion KB sample workspace.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Card body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:28px 32px;">

                    <!-- Role badge -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:${rc.bg};border:1px solid ${rc.border};border-radius:10px;padding:14px 20px;">
                          <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:rgba(236,233,255,0.38);text-transform:uppercase;letter-spacing:0.08em;">Your role</p>
                          <p style="margin:0;font-size:17px;font-weight:700;color:${rc.text};">${role}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 28px;font-size:13px;color:rgba(236,233,255,0.5);line-height:1.7;">
                      Algion KB sample is a personal content planning workspace — track ideas, scripts, production, and performance all in one place. No account required.
                    </p>

                    <!-- CTA button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${appUrl}"
                            style="display:inline-block;background:linear-gradient(135deg,#7C5CFC,#5638D8);color:#ffffff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.01em;box-shadow:0 0 28px rgba(124,92,252,0.45);">
                            Open Algion KB sample &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Card footer -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.07);padding:16px 32px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:rgba(236,233,255,0.22);">
                      This invite was sent to ${email}. All your data stays in your browser.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
