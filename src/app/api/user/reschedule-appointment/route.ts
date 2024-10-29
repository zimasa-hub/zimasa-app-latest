import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      notes,
      appointmentDate,
      startTime,
      duration,
      endTime,
      scheduleType,
      communicationPreference,
      location
    } = body
    const accessToken = await getValidAccessToken()

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    const appointmentData = {
      id: Number(id),
      notes: notes || '',
      appointmentDate,
      startTime,
      duration: Number(duration),
      endTime,
      scheduleType: Number(scheduleType),
      communicationPreference,
      location
    }

    // Log the request payload for debugging
    console.log('Reschedule request payload:', JSON.stringify(appointmentData, null, 2))

    const response = await fetch(`${process.env.NEXT_PUBLIC_APPOINTMENTS}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(appointmentData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error response from appointments API:', errorData)
      return NextResponse.json({ error: 'Failed to reschedule appointment', details: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in rescheduling appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}