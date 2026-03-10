'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type TrackingMethod = 'manual' | 'apple' | 'google' | 'ring_one'
type Goal = 'sleep' | 'stress' | 'energy' | 'weight' | 'habits' | 'couples'

const goals: { id: Goal; label: string; emoji: string }[] = [
  { id: 'sleep', label: 'Better Sleep', emoji: '😴' },
  { id: 'stress', label: 'Less Stress', emoji: '🧘' },
  { id: 'energy', label: 'More Energy', emoji: '⚡' },
  { id: 'weight', label: 'Manage Weight', emoji: '⚖️' },
  { id: 'habits', label: 'Build Habits', emoji: '✅' },
  { id: 'couples', label: 'Track with My Partner', emoji: '💑' },
]

const trackingMethods: { id: TrackingMethod; label: string; description: string }[] = [
  { id: 'manual', label: 'Manual Logging', description: 'Enter data yourself daily' },
  { id: 'apple', label: 'Apple Health', description: 'Sync from your iPhone or Watch' },
  { id: 'google', label: 'Google Health', description: 'Sync from Android or Fitbit' },
  { id: 'ring_one', label: 'Ring One', description: 'Auto-sync from your smart ring' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])
  const [trackingMethod, setTrackingMethod] = useState<TrackingMethod>('manual')
  const [saving, setSaving] = useState(false)

  function toggleGoal(id: Goal) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          date_of_birth: dob || null,
          gender: gender || null,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      toast.success("You're all set! Let's build something great.")
      router.push('/dashboard')
    } catch {
      toast.error('Could not save your profile. You can update it later.')
      router.push('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#F5C842] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#1B2A4A]" />
          </div>
          <span className="font-bold text-xl text-white">ET AI ONE</span>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-[#F5C842]' : s < step ? 'w-2 bg-[#F5C842]/50' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white">
                  Welcome to ET AI ONE
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Let us get to know you. Everything is optional.
                </p>
              </div>

              <div>
                <Label htmlFor="display-name">What should we call you?</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nickname or first name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Gender (optional)</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['male', 'female', 'non-binary', 'prefer-not-to-say'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g === gender ? '' : g)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors capitalize ${
                        gender === g
                          ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#1B2A4A]'
                      }`}
                    >
                      {g.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="gold"
                className="w-full gap-2"
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white">
                  What matters most to you?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select everything that applies. Your coach will personalize around this.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                      selectedGoals.includes(goal.id)
                        ? 'border-[#F5C842] bg-[#F5C842]/10'
                        : 'border-gray-100 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{goal.emoji}</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedGoals.includes(goal.id)
                          ? 'text-[#1B2A4A] dark:text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {goal.label}
                    </span>
                    {selectedGoals.includes(goal.id) && (
                      <Check className="w-4 h-4 text-[#F5C842] ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="gold"
                  className="flex-1 gap-2"
                  onClick={() => setStep(3)}
                  disabled={selectedGoals.length === 0}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white">
                  How do you want to track?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You can always add more sources later.
                </p>
              </div>

              <div className="space-y-2">
                {trackingMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setTrackingMethod(method.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      trackingMethod === method.id
                        ? 'border-[#F5C842] bg-[#F5C842]/10'
                        : 'border-gray-100 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <p
                        className={`font-medium text-sm ${
                          trackingMethod === method.id
                            ? 'text-[#1B2A4A] dark:text-white'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                    {trackingMethod === method.id && (
                      <Check className="w-5 h-5 text-[#F5C842]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={finish}
                  disabled={saving}
                >
                  {saving ? 'Setting up...' : 'Go to My Dashboard'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
