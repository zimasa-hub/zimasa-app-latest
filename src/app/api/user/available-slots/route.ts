import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { getValidAccessToken } from '@/lib/utils/auth-utils'

interface TimeSlot {
  startTime: string
  endTime: string
  booked: boolean
}

interface AvailableSlot {
  date: string
  timeSlots: TimeSlot[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const providerServiceId = searchParams.get('providerServiceId')
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const accessToken = await getValidAccessToken()

  if (!providerServiceId || !year || !month) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {

    const apiUrl = `${process.env.NEXT_PUBLIC_APPOINTMENTS_SLOTS}`;
    
    const response = await axios.get<AvailableSlot[]>(apiUrl,
      {
        params: {
          providerServiceId,
          year,
          month
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 })
  }
}