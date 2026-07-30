import { Head, router, useHttp } from '@inertiajs/react';
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import checkout from '@/routes/checkout';

type PageProps = {
    order: { id: number; total: string };
    clientSecret: string;
    stripeKey: string;
};

type ConfirmResponse = {
    status: string;
    paymentStatus: string;
    redirect: string;
};

function PayForm({ order }: { order: PageProps['order'] }) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const http = useHttp<Record<string, never>, ConfirmResponse>({});

    async function confirmOnServer() {
        const response = await http.post(checkout.confirm(order.id).url);
        router.visit(response.redirect);
    }

    async function failOnServer() {
        await http.post(checkout.fail(order.id).url);
    }

    // Handle the case where Stripe redirected the customer back here after
    // an off-site payment method (e.g. a bank redirect) completed.
    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecretParam = new URLSearchParams(
            window.location.search,
        ).get('payment_intent_client_secret');

        if (!clientSecretParam) {
            return;
        }

        stripe
            .retrievePaymentIntent(clientSecretParam)
            .then(({ paymentIntent }) => {
                if (paymentIntent?.status === 'succeeded') {
                    void confirmOnServer();
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stripe]);

    async function submit(event: React.FormEvent) {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setSubmitting(true);
        setErrorMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: window.location.href,
            },
        });

        if (error) {
            setErrorMessage(
                error.message ?? 'Payment failed. Please try again.',
            );
            setSubmitting(false);

            if (error.type === 'card_error' || error.type === 'validation_error') {
                await failOnServer();
            }

            return;
        }

        if (paymentIntent?.status === 'succeeded') {
            await confirmOnServer();

            return;
        }

        setSubmitting(false);
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <PaymentElement />
            {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                </p>
            )}
            <Button
                type="submit"
                disabled={!stripe || submitting}
                className="w-full"
            >
                Pay ${order.total}
            </Button>
        </form>
    );
}

export default function CheckoutPay({
    order,
    clientSecret,
    stripeKey,
}: PageProps) {
    const stripePromise = useMemo(() => loadStripe(stripeKey), [stripeKey]);

    return (
        <>
            <Head title="Payment" />

            <div className="mx-auto max-w-lg space-y-6 p-4">
                <Heading title="Payment" description={`Order #${order.id}`} />

                <Card>
                    <CardHeader>
                        <CardTitle>Pay with card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Elements
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <PayForm order={order} />
                        </Elements>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CheckoutPay.layout = {
    breadcrumbs: [{ title: 'Payment', href: '#' }],
};
