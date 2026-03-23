import Link from 'next/link'
import { Globe, MessageSquare, Heart, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CommunityPost {
  id: string
  content: string
  category: string
  likes_count: number
  replies_count: number
  created_at: string
  author_name: string
}

interface CommunityPulseProps {
  posts: CommunityPost[]
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const mins = Math.floor((now - then) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const CATEGORY_EMOJI: Record<string, string> = {
  wins: '🏆',
  questions: '❓',
  resources: '🔗',
  introductions: '👋',
  general: '💬',
}

export function CommunityPulse({ posts }: CommunityPulseProps) {
  if (posts.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Earth Station
        </h2>
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">The community is warming up.</p>
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#C9A84C] mt-2 hover:underline"
            >
              Be the first to post <ArrowRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Earth Station
        </h2>
        <Link
          href="/community"
          className="text-xs font-medium text-[#C9A84C] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">
                    {CATEGORY_EMOJI[post.category] ?? '💬'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-[#1B2A4A]">
                        {post.author_name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Heart className="w-3 h-3" /> {post.likes_count}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MessageSquare className="w-3 h-3" /> {post.replies_count}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
