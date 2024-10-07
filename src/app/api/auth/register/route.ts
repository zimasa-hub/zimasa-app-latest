import { NextResponse } from 'next/server'
import KcAdminClient from '@keycloak/keycloak-admin-client'

const kcAdminClient = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_BASE_URL,
  realmName: process.env.KEYCLOAK_REALM,
})

export async function POST(request: Request) {
  try {
    const { username, email, password, mobileNumber, firstName, lastName } = await request.json()

    await kcAdminClient.auth({
      username: process.env.KEYCLOAK_ADMIN_USERNAME,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'default-client-id',
    })

    const user = await kcAdminClient.users.create({
      username,
      email,
      firstName,
      lastName,
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
      attributes: {
        mobileNumber: [mobileNumber],
      },
    })

    let emailSent = false;
    try {
      await kcAdminClient.users.executeActionsEmail({
        id: user.id!,
        actions: ['VERIFY_EMAIL'],
      })
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
    }

    return NextResponse.json({ 
      message: emailSent 
        ? 'User registered successfully. Please check your email to verify your account.' 
        : 'User registered successfully. Email verification is currently unavailable. Please contact support.',
      emailSent
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    let errorMessage = 'Registration failed. Please try again.'
    if (error.responseData && error.responseData.errorMessage) {
      errorMessage = `Registration failed: ${error.responseData.errorMessage}`
    }
    
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}