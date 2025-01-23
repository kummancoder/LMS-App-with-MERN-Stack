import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';



const BuyCourse = ({ courseId }) => {
    const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] = useCreateCheckoutSessionMutation();

    const purchaseCourseHandler = async () => {
        await createCheckoutSession(courseId);
    }

    useEffect(() => {
        if (isSuccess) {
            if (data?.data) {
                window.location.href = data.data;  // Redirect to the Stripe checkout URL
            }
        }
        if (isError) {
            toast.error(error?.data.message || 'Failed to create checkout session');
        }
    }, [data, isSuccess, isError, error]);

    return (
        <Button disabled={isLoading} className='w-full' onClick={purchaseCourseHandler}>
            {
                isLoading ?
                    <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Please wait
                    </> : 'Buy Course'
            }
        </Button>
    )
}

export default BuyCourse