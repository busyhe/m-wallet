'use server'

import notion, { databaseId } from '@/lib/notion'
import type { Subscription, SubscriptionFormData, SubscriptionCycle, Currency } from '@/lib/types'
import type {
  PageObjectResponse,
  CreatePageParameters,
  QueryDataSourceResponse
} from '@notionhq/client/build/src/api-endpoints'

// Helper: cast properties for write operations
type WriteProperties = CreatePageParameters['properties']

// Helper type for Notion page properties
type PageProperties = PageObjectResponse['properties']
type PropertyValue = PageProperties[string]

// Type-safe property accessors
function getTitleText(prop: PropertyValue | undefined): string {
  if (prop?.type === 'title') return prop.title[0]?.plain_text || ''
  return ''
}
function getRichText(prop: PropertyValue | undefined): string {
  if (prop?.type === 'rich_text') return prop.rich_text[0]?.plain_text || ''
  return ''
}
function getNumber(prop: PropertyValue | undefined): number {
  if (prop?.type === 'number') return prop.number ?? 0
  return 0
}
function getSelectName(prop: PropertyValue | undefined): string {
  if (prop?.type === 'select') return prop.select?.name || ''
  return ''
}
function getUrl(prop: PropertyValue | undefined): string {
  if (prop?.type === 'url') return prop.url || ''
  return ''
}
function getDateStart(prop: PropertyValue | undefined): string {
  if (prop?.type === 'date') return prop.date?.start || ''
  return ''
}

// Parse Notion page to Subscription
function parseSubscription(page: PageObjectResponse): Subscription {
  const props = page.properties
  return {
    id: page.id,
    name: getTitleText(props.Name),
    icon: getUrl(props.Icon),
    price: getNumber(props.Price),
    currency: (getSelectName(props.Currency) || 'CNY') as Currency,
    cycle: (getSelectName(props.Cycle) || 'monthly') as SubscriptionCycle,
    customCycleDays: getNumber(props.CustomCycleDays) || undefined,
    startDate: getDateStart(props.StartDate),
    endDate: getDateStart(props.EndDate) || undefined,
    description: getRichText(props.Description),
    category: getSelectName(props.Category),
    position: getNumber(props.Position),
    color: getSelectName(props.Color) || '#6366f1'
  }
}

// Get all subscriptions
export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const response = await notion.request<QueryDataSourceResponse>({
      path: `databases/${databaseId}/query`,
      method: 'post',
      body: {
        sorts: [{ property: 'Position', direction: 'ascending' }]
      }
    })
    return response.results.filter((page): page is PageObjectResponse => 'properties' in page).map(parseSubscription)
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
    return []
  }
}

// Create a new subscription
export async function createSubscription(data: SubscriptionFormData): Promise<Subscription | null> {
  try {
    const existing = await getSubscriptions()
    const maxPosition = existing.reduce((max, s) => Math.max(max, s.position), 0)

    const properties: Record<string, unknown> = {
      Name: { title: [{ text: { content: data.name } }] },
      Icon: { url: data.icon || null },
      Price: { number: data.price },
      Currency: { select: { name: data.currency } },
      Cycle: { select: { name: data.cycle } },
      StartDate: { date: { start: data.startDate } },
      Description: { rich_text: [{ text: { content: data.description } }] },
      Category: { select: { name: data.category || 'Other' } },
      Position: { number: maxPosition + 1 },
      Color: { select: { name: data.color || '#6366f1' } }
    }
    if (data.customCycleDays) {
      properties.CustomCycleDays = { number: data.customCycleDays }
    }
    if (data.endDate) {
      properties.EndDate = { date: { start: data.endDate } }
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties as WriteProperties
    })
    return parseSubscription(response as PageObjectResponse)
  } catch (error) {
    console.error('Failed to create subscription:', error)
    return null
  }
}

// Update an existing subscription
export async function updateSubscription(id: string, data: Partial<SubscriptionFormData>): Promise<boolean> {
  try {
    const properties: Record<string, unknown> = {}
    if (data.name !== undefined) properties.Name = { title: [{ text: { content: data.name } }] }
    if (data.icon !== undefined) properties.Icon = { url: data.icon || null }
    if (data.price !== undefined) properties.Price = { number: data.price }
    if (data.currency !== undefined) properties.Currency = { select: { name: data.currency } }
    if (data.cycle !== undefined) properties.Cycle = { select: { name: data.cycle } }
    if (data.customCycleDays !== undefined) properties.CustomCycleDays = { number: data.customCycleDays }
    if (data.startDate !== undefined) properties.StartDate = { date: { start: data.startDate } }
    if (data.endDate !== undefined) properties.EndDate = { date: { start: data.endDate } }
    if (data.description !== undefined)
      properties.Description = { rich_text: [{ text: { content: data.description } }] }
    if (data.category !== undefined) properties.Category = { select: { name: data.category } }
    if (data.color !== undefined) properties.Color = { select: { name: data.color } }

    await notion.pages.update({
      page_id: id,
      properties: properties as WriteProperties
    })
    return true
  } catch (error) {
    console.error('Failed to update subscription:', error)
    return false
  }
}

// Delete a subscription (archive in Notion)
export async function deleteSubscription(id: string): Promise<boolean> {
  try {
    await notion.pages.update({ page_id: id, archived: true })
    return true
  } catch (error) {
    console.error('Failed to delete subscription:', error)
    return false
  }
}

// Batch reorder subscriptions
export async function reorderSubscriptions(orderedIds: string[]): Promise<boolean> {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        notion.pages.update({
          page_id: id,
          properties: {
            Position: { number: index }
          } as WriteProperties
        })
      )
    )
    return true
  } catch (error) {
    console.error('Failed to reorder subscriptions:', error)
    return false
  }
}
