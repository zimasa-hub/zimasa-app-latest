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
    let accessToken = await getValidAccessToken()
    const decodedToken = jwtDecode<DecodedToken>(accessToken)
    const currentMemberId = decodedToken.sub

    // First API call to get provider user ID
    const providerUserUrl = `${process.env.NEXT_PUBLIC_DOCTORS}?userEntityId=${currentMemberId}`
    const providerUserResponse = await axios.get<DoctorsDataResponse>(providerUserUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (providerUserResponse.data.content.length === 0) {
      return NextResponse.json({ error: 'No provider user found' }, { status: 404 })
    }

    const providerUserId = providerUserResponse.data.content[0].id

    // Second API call to get appointments
    const currentDate = new Date().toISOString().split('T')[0]
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)
    const endDateString = endDate.toISOString().split('T')[0]

    const appointmentsUrl = `${process.env.NEXT_PUBLIC_APPOINTMENTS_SEARCH}?providerUserId=${providerUserId}&startDate=${currentDate}&endDate=${endDateString}`
    
    const appointmentsResponse = await axios.get<{ content: Appointment[] }>(appointmentsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

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
    console.error('Error in GET /api/user/doc-appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: error.response?.status || 500 }
    )
  }
}