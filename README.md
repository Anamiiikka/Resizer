# AI Image Outpainting — Behooked

A web application for AI-based image extension and outpainting using the [fal-ai/smart-resize](https://fal.ai/models/fal-ai/smart-resize) model.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, Uvicorn |
| Frontend | React 18, Vite |
| AI Model | fal-ai/smart-resize |
| Styling | CSS Modules |

---

## Project Structure

```
Resizer/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/image.py
│   │   ├── services/fal_service.py
│   │   └── utils/file_utils.py
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AspectRatioSelector/
    │   │   ├── CanvasResizer/
    │   │   ├── DownloadButton/
    │   │   ├── Footer/
    │   │   ├── Header/
    │   │   ├── ImagePreview/
    │   │   ├── ImageUploader/
    │   │   └── Loader/
    │   ├── hooks/useImageProcess.js
    │   ├── pages/Home/
    │   ├── services/api.js
    │   ├── styles/globals.css
    │   └── utils/imageUtils.js
    ├── .env
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup & Start Commands

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Fal API key — set in `backend/.env`

---

### Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server (runs on http://localhost:8000)
python run.py
```

The backend auto-reloads on file changes. API docs available at `http://localhost:8000/docs`.

---

### Frontend

```bash
# Navigate to frontend (in a separate terminal)
cd frontend

# Install dependencies
npm install

# Start the dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

### Environment Variables

**`backend/.env`**
```
FAL_KEY=your_fal_api_key_here
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/image/process` | Run outpainting via Fal AI |
| POST | `/api/image/dimensions` | Get width & height of uploaded image |

### `POST /api/image/process`

**Form fields:**
- `file` — image file (JPEG, PNG, or WebP, max 10 MB)
- `target_width` — output width in pixels (64–4096)
- `target_height` — output height in pixels (64–4096)

**Response:**
```json
{
  "output_url": "https://...",
  "result": { ... }
}
```

---

## Features

### Image Upload
- Drag-and-drop or click-to-browse file picker
- Accepts JPEG, PNG, WebP up to 10 MB
- Instant thumbnail preview with file name and size
- "Change image" button to swap without page reload

### Two Sizing Modes

**Preset Sizes**
- One-click presets: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9
- Shows pixel dimensions for each ratio
- Custom mode with free width/height inputs (clamped 64–4096px)

**Manual Extend (Canvas)**
- Interactive canvas rendered with the HTML Canvas API
- Drag handles on all four sides (top, bottom, left, right) to extend each edge independently
- Real-time preview as you drag — edge pixels are sampled, stretched, and blurred using `ctx.filter: blur()` with clip regions so the fill area gives a soft visual hint of what the AI will generate
- Blue tint overlay marks AI-generated zones
- Dashed boundary ring separates the original image from extended areas
- Live pixel labels on each handle showing the extension amount (e.g. `+320px`)
- Live dimension readout: `Original 400×300px → Output 720×450px`
- Reset button to return to original dimensions

### AI Generation
- Uploads the image to the Fal CDN via `fal_client.upload_image_async` before calling the model (avoids base64 payload size issues)
- Calls `fal-ai/smart-resize` with `target_sizes: ["WxH"]` format
- Animated loader with four step labels and progress dots

### Result View
- Before/After toggle to compare original and output
- "AI Extended" badge on the output image
- Download button — fetches the image as a blob and triggers a local save
- "Start over" button to reset the full flow

### UI & UX
- Dark theme matching behooked.co (`#0A0A0C` background, `#007CFF` primary)
- Subtle blue grid background
- Sticky frosted-glass header with backdrop blur
- Fully responsive layout
- Smooth hover glow effects on buttons
- Error messages with inline display and clear copy
- Disabled states with tooltips on all interactive elements
