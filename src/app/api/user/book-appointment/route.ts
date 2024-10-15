import { NextResponse } from 'next/server'
import axios from 'axios'
import { getValidAccessToken } from '@/lib/utils/auth-utils';

export async function POST(request: Request) {
  try {
    const appointmentData = await request.json()

   
    let accessToken = await getValidAccessToken();

    const apiEndpoint = process.env.NEXT_PUBLIC_BOOK_APPOINTMENTS;

    console.log("APPOINTMENT DATTA: ", appointmentData)

    if (!apiEndpoint) {
      throw new Error('NEXT_PUBLIC_ZIMASA_LOG_FOOD is not defined in the environment');
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
    let accessToken = await getValidAccessToken();

    // Get the current date in 'YYYY-MM-DD' format
    const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    
    // Append the current date as a query parameter to the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_GET_APPOINTMENTS}?localDate=${currentDate}`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });

  } catch (error: any) {
    console.error('Error in GET /api/user/book-appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal goals' },
      { status: error.response?.status || 500 }
    );
  }
}