'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Music } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function NewMeditationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [formData, setFormData] = useState({
    lesson_id: '',
    title: '',
    duration_minutes: 5,
  })

  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioFileName, setAudioFileName] = useState<string>('')

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setAudioFileName(file.name)
    }
  }

  const uploadAudio = async (): Promise<string | null> => {
    if (!audioFile) {
      alert('Please select an audio file')
      return null
    }

    const supabase = createClient()
    const fileName = `meditation-${Date.now()}-${audioFile.name}`
    
    setUploadProgress(10)
    
    const { data, error } = await supabase.storage
      .from('meditation-audio')
      .upload(fileName, audioFile, {
        contentType: audioFile.type,
        upsert: false,
      })

    setUploadProgress(100)

    if (error) {
      console.error('Error uploading audio:', error)
      alert('Error uploading audio: ' + error.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('meditation-audio')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload audio file
      const audioUrl = await uploadAudio()
      if (!audioUrl) {
        setLoading(false)
        return
      }

      // Update lesson with meditation audio
      const supabase = createClient()
      const { error } = await supabase
        .from('lessons')
        .update({
          meditation_audio_url: audioUrl,
          is_meditation: true,
          duration_minutes: formData.duration_minutes,
        })
        .eq('id', formData.lesson_id)

      if (error) throw error

      alert('✅ Meditation audio uploaded successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error creating meditation:', error)
      alert('❌ Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] pb-24">
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-lg">
        <button onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Upload Meditation Audio</h1>
        <p className="text-white/80">Add meditation audio to an existing lesson</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                💡 <strong>Tip:</strong> Make sure the lesson exists first. You can find the lesson ID in the database.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson ID *
              </label>
              <Input
                value={formData.lesson_id}
                onChange={(e) => setFormData({ ...formData, lesson_id: e.target.value })}
                placeholder="Enter lesson UUID"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The meditation will be linked to this lesson
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meditation Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Grounding Meditation"
                required
              />
            </div>

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
                Audio File (MP3) *
              </label>
              
              {audioFileName ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Music className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{audioFileName}</p>
                      <p className="text-sm text-gray-600">
                        {(audioFile!.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioFile(null)
                      setAudioFileName('')
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload audio file
                  </span>
                  <span className="text-xs text-gray-500">MP3 format recommended</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

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
                disabled={loading || !audioFile}
                className="flex-1"
              >
                {loading ? 'Uploading...' : 'Upload Meditation'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

