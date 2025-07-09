"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { X, RotateCcw, Check, Move, ZoomIn, Crop } from "lucide-react"

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImageUrl: string) => void
  onCancel: () => void
  aspectRatio?: number // width/height ratio, default 1 for square
  title: string
}

export default function ImageEditor({ imageUrl, onSave, onCancel, aspectRatio = 1, title }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState([100])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 })

  // Calculate canvas dimensions based on aspect ratio
  useEffect(() => {
    const maxWidth = 400
    const maxHeight = 400

    let width, height
    if (aspectRatio >= 1) {
      width = maxWidth
      height = maxWidth / aspectRatio
    } else {
      height = maxHeight
      width = maxHeight * aspectRatio
    }

    setCanvasSize({ width, height })
  }, [aspectRatio])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image || !imageLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate scaled dimensions
    const scale = zoom[0] / 100
    const scaledWidth = image.naturalWidth * scale
    const scaledHeight = image.naturalHeight * scale

    // Draw image with current position and zoom
    ctx.drawImage(image, position.x, position.y, scaledWidth, scaledHeight)

    // Draw crop overlay
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    ctx.setLineDash([])
  }, [zoom, position, imageLoaded])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  useEffect(() => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = image.src
        setImageLoaded(true)

        // Center the image initially
        const canvas = canvasRef.current
        if (canvas) {
          const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
          setZoom([scale * 100])
          setPosition({
            x: (canvas.width - image.naturalWidth * scale) / 2,
            y: (canvas.height - image.naturalHeight * scale) / 2,
          })
        }
      }
    }
    image.src = imageUrl
  }, [imageUrl])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleReset = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
    setZoom([scale * 100])
    setPosition({
      x: (canvas.width - image.naturalWidth * scale) / 2,
      y: (canvas.height - image.naturalHeight * scale) / 2,
    })
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a new canvas for the final output
    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = canvasSize.width
    outputCanvas.height = canvasSize.height
    const outputCtx = outputCanvas.getContext("2d")

    if (!outputCtx) return

    // Draw the current canvas content to the output canvas
    outputCtx.drawImage(canvas, 0, 0)

    // Convert to blob and call onSave
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          onSave(url)
        }
      },
      "image/jpeg",
      0.9,
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Edit {title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canvas */}
          <div className="flex justify-center">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="cursor-move bg-gray-100"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <img ref={imageRef} className="hidden" alt="Source" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <ZoomIn className="w-4 h-4" />
                Zoom: {zoom[0]}%
              </Label>
              <Slider value={zoom} onValueChange={setZoom} min={50} max={300} step={5} className="w-full" />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Move className="w-4 h-4" />
              <span>Drag the image to reposition</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
