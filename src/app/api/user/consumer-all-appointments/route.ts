import { NextResponse } from 'next/server'
import axios from 'axios'
import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { jwtDecode } from 'jwt-decode'
import { DoctorsDataResponse, DoctorData } from '@/lib/interfaces/providers/providers'
import { Appointment } from '@/lib/interfaces/appointments/appointments'

interface DecodedToken {
  sub: string
  // Add other token claims as needed
}

export async function GET() {
  try {
    const accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    const currentMemberId = decodedToken.sub


    const appointmentsUrl = `${process.env.NEXT_PUBLIC_APPOINTMENTS_SEARCH}?userEntityId=${currentMemberId}`
    const appointmentsResponse = await axios.get<{ content: Appointment[] }>(appointmentsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Create a sanitized version of the response to avoid circular references
    const sanitizedResponse = JSON.parse(JSON.stringify({
     
      appointmentsResponse: appointmentsResponse.data
    }))

    return NextResponse.json(sanitizedResponse, { status: 200 })
  } catch (error: any) {
    console.error('Error in GET /api/consumer-all-appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: error.response?.status || 500 }
    )
  }
}