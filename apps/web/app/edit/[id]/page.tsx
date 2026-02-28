import { notFound } from 'next/navigation'
import { SubscriptionForm } from '@/components/subscription-form'
import { getSubscription } from '@/lib/actions/subscriptions'

interface EditSubscriptionPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSubscriptionPage({ params }: EditSubscriptionPageProps) {
  const { id } = await params
  const subscription = await getSubscription(id)

  if (!subscription) {
    notFound()
  }

  return <SubscriptionForm editData={subscription} />
}
