export type OverviewAnalytics = {
  chatbots: {
    total: number
    active: number
    draft: number
    archived: number
  }
  conversations: {
    total: number
    open: number
    closed: number
  }
  messages: {
    total: number
    user: number
    bot: number
    system: number
  }
  flows: {
    total: number
    published: number
  }
}
