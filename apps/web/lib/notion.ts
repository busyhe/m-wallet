import { Client } from '@notionhq/client'

// Initialize Notion client singleton
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28'
})

export const databaseId = process.env.NOTION_DATABASE_ID!

export default notion
