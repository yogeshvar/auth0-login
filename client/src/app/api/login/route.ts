import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers'

export async function GET() {
  const session = await getSession();

  const response = await fetch('http://localhost:4000/api/protected', {
    headers: {
      Authorization: `Bearer ${session?.idToken}`
    }
  });
  const data = await response.json();

  if (session?.idToken) {
    cookies().set('idToken', session?.idToken ?? '', { secure: true, sameSite: 'strict', path: '/' });
    return NextResponse.json({ idToken: session?.idToken, data: data.user });
  } 
  return NextResponse.redirect('/api/login');
}