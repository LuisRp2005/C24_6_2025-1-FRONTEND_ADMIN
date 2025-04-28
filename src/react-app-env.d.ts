/// <reference types="react-scripts" />

interface ImportMetaEnv {
    readonly REACT_APP_CLOUDINARY_CLOUD_NAME: string
    readonly REACT_APP_CLOUDINARY_UPLOAD_PRESET: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  