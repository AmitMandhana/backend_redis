import { NextResponse } from "next/server";

export  async function POST(req : Request) {
    
      const { token } = await req.json();
      console.log('Received URL:', process.env.NEXT_PUBLIC_BACKEND_URL);  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        console.log('Data from backend:', data);
  
        if (data.success) {
          return NextResponse.json({ success: true, user: data.response.user });
        } else {
          return NextResponse.json({ success: false, message: 'Error with user creation' });
        }
      } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' });
      }
    } 
  
  