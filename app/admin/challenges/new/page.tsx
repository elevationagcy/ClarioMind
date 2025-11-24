'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function NewChallengePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    duration: '',
    participants: 0,
    category: 'Personal Growth',
    icon: '',
  })

  const [iconFile, setIconFile] = useState<File | null>(null)

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadIcon = async (): Promise<string | null> => {
    if (!iconFile) return null

    const supabase = createClient()
    const fileName = `challenge-${Date.now()}-${iconFile.name}`
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`challenges/${fileName}`, iconFile, {
        contentType: iconFile.type,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading icon:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`challenges/${fileName}`)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let iconUrl = formData.icon
      if (iconFile) {
        const uploadedUrl = await uploadIcon()
        if (uploadedUrl) {
          iconUrl = uploadedUrl
        }
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('challenges')
        .insert({
          ...formData,
          icon: iconUrl,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      alert('✅ Challenge created successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error creating challenge:', error)
      alert('❌ Error creating challenge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] pb-24">
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-lg">
        <button onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Create New Challenge</h1>
        <p className="text-white/80">Add a guided challenge</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 7-Day Mindfulness Challenge"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown) *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="# Challenge Details\n\nFull challenge content..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none min-h-[300px] font-mono text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="7 days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                <Input
                  type="number"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Personal Growth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon / Thumbnail</label>
              
              {iconPreview ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setIconFile(null)
                      setIconPreview(null)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                </label>
              )}

              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🏆 or https://..."
                className="mt-2"
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Challenge'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

