import { NextResponse } from 'next/server'
import axios from 'axios'
import { getValidAccessToken } from '@/lib/utils/auth-utils';
import { jwtDecode } from 'jwt-decode'
import { Appointment } from '@/lib/interfaces/appointments/appointments';

interface DecodedToken {
  sub: string
  // Add other token claims as needed
}

export async function POST(request: Request) {
  try {
    const appointmentData = await request.json()

   
    let accessToken = await getValidAccessToken();

    const apiEndpoint = process.env.NEXT_PUBLIC_APPOINTMENTS;

    console.log("APPOINTMENT DATA: ", appointmentData)

    if (!apiEndpoint) {
      throw new Error('NEXT_PUBLIC_BOOK_APPOINTMENTS is not defined in the environment');
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorResponse)}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
   console.error('Error in POST /api/user/book-appointment:', error);
   return NextResponse.json(
    { error: 'An error occurred while processing your request' },
    { status: 500 }
  );

  }
  
}

// Handle GET request with current date
export async function GET() {
  try {
    let accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    const currentMemberId = decodedToken.sub

    const currentDate = new Date().toISOString().split('T')[0]
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)
    const endDateString = endDate.toISOString().split('T')[0]

    const appointmentsUrl = `${process.env.NEXT_PUBLIC_APPOINTMENTS_SEARCH}?userEntityId=${currentMemberId}&startDate=${currentDate}&endDate=${endDateString}`
  
    
    const appointmentsResponse = await axios.get<{ content: Appointment[] }>(appointmentsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Sort appointments by date and time
    const sortedAppointments = appointmentsResponse.data.content.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.startTime}`)
      const dateB = new Date(`${b.appointmentDate}T${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })

    // Get the two most upcoming appointments
    const upcomingAppointments = sortedAppointments.slice(0, 2)

    return NextResponse.json({ appointments: upcomingAppointments }, { status: 200 })
  } catch (error: any) {
    console.error('Error in GET /api/user/book-appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: error.response?.status || 500 }
    )
  }
}