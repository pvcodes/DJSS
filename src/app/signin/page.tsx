'use client';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function SignIn() {
    return (
        <div className='flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-center'>Sign in</CardTitle>
                    <CardDescription className='text-center'>
                        Continue with one of the following methods
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <Button
                        variant='outline'
                        className='w-full'
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                    >
                        {/* <Mail className="mr-2 h-4 w-4" /> */}
                        Sign in with Google
                    </Button>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            {/* <Separator className='w-full' /> */}
                        </div>
                        {/* <div className='relative flex justify-center text-xs uppercase'>
                            <span className=' px-2 text-gray-500'>Or</span>
                        </div> */}
                    </div>
                    {/* <Button
                        variant='outline'
                        className='w-full '
                        onClick={() => signIn('github', { callbackUrl: prevPath })}
                    >
                        <Github className='mr-2 h-4 w-4' />
                        Sign in with GitHub
                    </Button> */}
                </CardContent>
                {/* <CardFooter className='flex flex-col'>
                    <p className='mt-2 text-center text-sm text-gray-500'>
                        By continuing, you agree to our{' '}
                        <Link href='/terms' className='font-medium text-blue-600 hover:text-blue-500'>
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href='/terms' className='font-medium text-blue-600 hover:text-blue-500'>
                            Privacy Policy
                        </Link>
                    </p>
                </CardFooter> */}
            </Card>
        </div>
    );
}
