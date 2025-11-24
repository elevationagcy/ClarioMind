'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function NewLessonPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    duration_minutes: 5,
    category: 'Neuroscience',
    order: 1,
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
    const fileName = `lesson-${Date.now()}-${iconFile.name}`
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`lessons/${fileName}`, iconFile, {
        contentType: iconFile.type,
        upsert: false,
      })

    if (error) {
      console.error('Error uploading icon:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`lessons/${fileName}`)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload icon if provided
      let iconUrl = formData.icon
      if (iconFile) {
        const uploadedUrl = await uploadIcon()
        if (uploadedUrl) {
          iconUrl = uploadedUrl
        }
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('lessons')
        .insert({
          ...formData,
          icon: iconUrl,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      alert('✅ Lesson created successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error creating lesson:', error)
      alert('❌ Error creating lesson')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-lg">
        <button onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Create New Lesson</h1>
        <p className="text-white/80">Add a new daily lesson</p>
      </div>

      {/* Form */}
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Understanding Alcohol's Effects"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the lesson"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Markdown supported) *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="# Lesson Content\n\nWrite your lesson content here using Markdown..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[300px] font-mono text-sm"
                required
              />
            </div>

            {/* Duration & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  min="1"
                  max="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Neuroscience">Neuroscience</option>
                  <option value="Physical Health">Physical Health</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Social">Social</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Coping Skills">Coping Skills</option>
                </select>
              </div>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day Number (Order)
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                min="1"
                placeholder="1"
              />
            </div>

            {/* Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon / Thumbnail
              </label>
              
              {iconPreview ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setIconFile(null)
                      setIconPreview(null)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition">
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

              <p className="text-xs text-gray-500 mt-2">Or enter emoji/URL below</p>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📚 or https://..."
                className="mt-2"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Lesson'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

