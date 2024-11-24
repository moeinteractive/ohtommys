import { NextResponse } from 'next/server';
import SparkPost from 'sparkpost';

const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY;

// Define recipient emails directly
const RECIPIENT_EMAILS = ['enkotommys@outlook.com', 'info@titanium6.com'];

const sparkpost = new SparkPost(SPARKPOST_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Format the email content
    const emailContent = `
      New Job Application Received
      
      Name: ${data.name}
      Phone: ${data.phone}
      Email: ${data.email}
      Position: ${data.position}
      Start Date: ${data.startDate}
      
      Available Days: ${data.availableDays.join(', ')}
      Preferred Shifts: ${data.shifts.join(', ')}
      
      Experience:
      ${data.experience}
    `;

    // Send email using SparkPost
    await sparkpost.transmissions.send({
      options: {
        sandbox: false,
      },
      content: {
        from: 'jobs@ohtommys.com',
        subject: `New Job Application - ${data.position}`,
        text: emailContent,
      },
      recipients: RECIPIENT_EMAILS.map((email) => ({ address: email })),
    });

    return NextResponse.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
