/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useCallback, useState } from 'react'
import { Box, Paper, Typography, IconButton, Grid, CircularProgress, Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface DragDropFileUploadProps {
  onFileUpload: (file: File) => void
  onSubmit: (file: File) => void
  onCancel: () => void
}

const DragDropFileUpload = ({ onFileUpload, onSubmit, onCancel }: DragDropFileUploadProps) => {
  const [dragOver, setDragOver] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault()
    setDragOver(false)
    const dataTransfer = event.dataTransfer
    if (dataTransfer && dataTransfer.files.length > 0) {
      handleFileChange(dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (file: File) => {
    setLoading(true)
    onFileUpload(file)
    setFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLoading(false)
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }, [])

  return (
    <Box>
      <Paper
        sx={{
          borderRadius: '50%',
          border: dragOver ? '2px dashed #000' : '2px dashed #aaa',
          padding: 9,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#eee' : '#fafafa',
          position: 'relative'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleChange}
        />
        <label htmlFor="raised-button-file">
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <CloudUploadIcon style={{ fontSize: 60 }} />
            </IconButton>
            <Typography>Drag and drop your images here</Typography>
          </Box>
        </label>
        {loading && (
          <CircularProgress
            size={24}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px'
            }}
          />
        )}
      </Paper>
      {imagePreview && (
        <Grid container justifyContent="center" style={{ marginTop: 16 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              component="img"
              src={imagePreview}
              alt="Image Preview"
              sx={{ width: '100%', height: 'auto' }}
            />
          </Grid>
        </Grid>
      )}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, ml: 0.5, mb: 2 }}>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button onClick={() => file && onSubmit(file)} variant="contained">
          Tải lên
        </Button>
      </Box>
    </Box>
  )
}

export default DragDropFileUpload
