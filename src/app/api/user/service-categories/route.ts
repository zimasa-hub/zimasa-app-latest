import { NextResponse } from 'next/server'
import axios from 'axios'
import { getValidAccessToken } from '@/lib/utils/auth-utils'

export async function GET(request: Request) {
  try {
    let accessToken = await getValidAccessToken()

    // Parse the URL to get query parameters
    const { searchParams } = new URL(request.url)
    const serviceTypeId = searchParams.get('serviceTypeId')
    const cursorId = searchParams.get('cursorId')
    const limit = searchParams.get('limit')
    const sortBy = searchParams.get('sortBy')
    const sortDirection = searchParams.get('sortDirection')

    const apiUrl = process.env.NEXT_PUBLIC_GET_SERVICE_CATEGORIES;

    if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_GET_SERVICE_CATEGORIES is not defined in the environment');
      }
  

    const response = await axios.get(apiUrl, {
      params: {
        serviceTypeId,
        cursorId,
        limit,
        sortBy,
        sortDirection
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return NextResponse.json(response.data, { status: 200 })

  } catch (error: any) {
    console.error('Error fetching service categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service categories' },
      { status: error.response?.status || 500 }
    )
  }
}