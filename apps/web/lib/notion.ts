import { Client } from '@notionhq/client'

// Initialize Notion client singleton
const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

export const databaseId = process.env.NOTION_DATABASE_ID!

export default notion
