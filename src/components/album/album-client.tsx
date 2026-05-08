"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { uploadPhoto } from "@/actions/photos"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Slot } from "@radix-ui/react-slot"
import { formatDate } from "@/lib/utils"
import type { Photo } from "@/lib/database.types"
import { toast } from "sonner"

interface Props { photos: Photo[] }

const schema = z.object({ caption: z.string().max(500).optional() })
type FormData = z.infer<typeof schema>

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    if (data.caption) formData.append("caption", data.caption)
    const result = await uploadPhoto(formData)
    setUploading(false)
    if (result.success) { toast.success("Photo uploaded!"); onSuccess() }
    else { toast.error(result.error ?? "Upload failed") }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="file" className="text-[var(--color-text-secondary)]">Photo</Label>
        <Input id="file" type="file" accept="image/*" required data-testid="album-upload-input"
          className="mt-1.5 bg-[var(--color-surface)] border-[var(--color-border)]"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div>
        <Label htmlFor="caption" className="text-[var(--color-text-secondary)]">Caption (optional)</Label>
        <Input id="caption" placeholder="Family moment..." data-testid="photo-caption-input"
          {...register("caption")}
          className="mt-1.5 bg-[var(--color-surface)] border-[var(--color-border)]" />
      </div>
      <Button type="submit" disabled={uploading || !file} className="w-full" data-testid="btn-upload-photo">
        {uploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </form>
  )
}

export function AlbumClient({ photos }: Props) {
  const [open, setOpen] = useState(false)
  const [photoList, setPhotoList] = useState(photos)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  function handleSuccess() { setPhotoList(prev => [...prev]); setOpen(false) }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Family Album</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Slot onClick={() => setOpen(true)}>
            <Button>+ Add Photo</Button>
          </Slot>
          <DialogContent className="bg-[var(--color-surface-elevated)] border-[var(--color-border)]">
            <DialogHeader><DialogTitle>Share a Photo</DialogTitle></DialogHeader>
            <UploadForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" data-testid="album-grid">
        {photoList.length === 0 ? (
          <div className="col-span-full text-center py-16 text-[var(--color-text-muted)]" data-testid="empty-album">
            <div className="text-4xl mb-2">📷</div><p className="text-sm">No photos yet</p>
          </div>
        ) : (
          photoList.map(photo => (
            <Dialog key={photo.id} onOpenChange={(o) => { if (!o) setSelectedPhoto(null) }}>
              <Slot onClick={() => setSelectedPhoto(photo)}>
                <button
                  data-testid={`album-photo-${photo.id}`}
                  className="aspect-square rounded-lg overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
                >
                  <img src={photo.url} alt={photo.caption ?? "Family photo"} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/111113/6366F1?text=?" }} />
                </button>
              </Slot>
              <DialogContent className="bg-[var(--color-surface-elevated)] border-[var(--color-border)] max-w-lg">
                <DialogHeader><DialogTitle>{formatDate(photo.created_at)}</DialogTitle></DialogHeader>
                <div>
                  <img src={photo.url} alt={photo.caption ?? "Family photo"} className="w-full rounded-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400/111113/6366F1?text=?" }} />
                  {photo.caption && <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{photo.caption}</p>}
                </div>
              </DialogContent>
            </Dialog>
          ))
        )}
      </div>
    </div>
  )
}
