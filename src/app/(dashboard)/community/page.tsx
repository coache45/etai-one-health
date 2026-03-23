'use client'

import { useEffect, useState, useCallback } from 'react'
import { Globe, Loader2 } from 'lucide-react'
import { PostCard } from '@/components/community/post-card'
import { PostComposer } from '@/components/community/post-composer'
import { ALL_CATEGORIES, CATEGORY_CONFIG } from '@/types/community'
import type { CommunityPost, PostCategory } from '@/types/community'
import { useUserStore } from '@/stores/user-store'

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useUserStore()

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'all') {
        params.set('category', activeCategory)
      }
      params.set('limit', '30')

      const res = await fetch(`/api/community?${params}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts ?? [])
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Earth Station</h1>
              <p className="text-sm text-slate-500">
                Your community hub — share wins, ask questions, connect.
              </p>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="mb-6">
          <PostComposer onPostCreated={loadPosts} />
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-sm px-3 py-1.5 rounded-full font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#1B2A4A] text-white'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Posts
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat]
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm px-3 py-1.5 rounded-full font-medium transition-all ${
                  active
                    ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-[#C9A84C]/40`
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {config.emoji} {config.label}
              </button>
            )
          })}
        </div>

        {/* Posts feed */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
            <span className="ml-2 text-sm text-slate-400">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No posts yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={profile?.id}
                onLike={() => {}}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
