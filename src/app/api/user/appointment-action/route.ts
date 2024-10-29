import { getValidAccessToken } from '@/lib/utils/auth-utils'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { appointmentId, action, reason, userEntityId } = body
    const accessToken = await getValidAccessToken()

    console.log("BODY : ", body)

 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APPOINTMENTS_ACTION}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          action,
          reason,
          appointmentId,
          userEntityId
        })
      })

      console.log('Response status:', response.status) // Log the response status

      const responseText = await response.text()
      console.log('Response body:', responseText) // Log the response body

      if (!response.ok) {
        throw new Error(`Failed to perform appointment action: ${responseText}`)
      }

      const data = JSON.parse(responseText)
      return NextResponse.json(data)
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      throw fetchError // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error in appointment action:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}