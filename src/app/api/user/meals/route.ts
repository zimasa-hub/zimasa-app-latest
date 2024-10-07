import { NextRequest, NextResponse } from 'next/server';
import { MealLog } from '@/lib/interfaces/meals/interfaces';
import { getValidAccessToken } from '@/lib/utils/auth-utils';

export async function POST(req: NextRequest) {
  try {
    let accessToken = await getValidAccessToken();

    const formData = await req.formData();

    const mealLog: MealLog = {
      mealTiming: parseInt(formData.get('mealTiming') as string),
      foodName: formData.get('foodName') as string,
      planned: formData.get('planned') === 'true',
      timeConsumed: formData.get('timeConsumed') as string,
      imageUrl: formData.get('image') instanceof File ? (formData.get('image') as File).name : undefined,
    };

    if (!mealLog.mealTiming || !mealLog.foodName || !mealLog.timeConsumed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiData = {
      mealTiming: mealLog.mealTiming,
      foodName: mealLog.foodName,
      planned: mealLog.planned,
      timeConsumed: mealLog.timeConsumed,
      imageUrl: mealLog.imageUrl,
    };

    const apiEndpoint = process.env.NEXT_PUBLIC_ZIMASA_LOG_FOOD;

    if (!apiEndpoint) {
      throw new Error('NEXT_PUBLIC_ZIMASA_LOG_FOOD is not defined in the environment');
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorResponse)}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in /api/meals:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}