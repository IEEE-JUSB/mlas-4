import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // let next = searchParams.get('next') ?? '/complete-profile';
  if (code) {
    const supabase = await createClient()
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (!authError) {
      const { data: { user } } = await supabase.auth.getUser() //from auth.users

      if (user) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          ''

        const adminSupabase = await createAdminClient();
        const { error: dbError } = await adminSupabase
          .from('users')
          .upsert(
            {
              id: user.id,
              name: fullName,
            },
            { onConflict: 'id', ignoreDuplicates: true } 
          )

        if (dbError) {
          console.error('Error upserting user into public.users:', dbError)
        }

        const { data: userData } = await adminSupabase
          .from('users')
          .select('phone, department') //whichever fields to check
          .eq('id', user.id)
          .single()

        const isProfileComplete = Boolean(userData?.phone && userData?.department)
        const targetPath = isProfileComplete ? '/dashboard' : '/complete-profile'

        //this part is taken from documentation
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${targetPath}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${targetPath}`)
        } else {
          return NextResponse.redirect(`${origin}${targetPath}`)
        }
      }
    }
  }

  // Return to error page if auth fails
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}