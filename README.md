# Professional PDF Viewer

A comprehensive, enterprise-grade PDF viewer built with React, TypeScript, and modern web technologies. Features advanced document navigation, annotation tools, search capabilities, and responsive design.

## 🚀 Features

### Document Display

- **High-fidelity PDF rendering** using react-pdf and PDF.js
- **Multi-page navigation** with smooth scrolling
- **Zoom controls** (25%-500%, fit-to-width, fit-to-page)
- **Page rotation** and document outline navigation
- **Responsive design** for desktop and mobile viewports

### Search & Navigation

- **Full-text search** with highlighting and result navigation
- **Thumbnail sidebar** with page previews
- **Document outline/bookmarks** for structured navigation
- **Keyboard shortcuts** for power users
- **Virtual scrolling** for large documents (100+ pages)

### Annotation System

- **Text highlighting** with color coding and notes
- **Shape annotations** (rectangles, circles, arrows)
- **Sticky note placement** and management
- **Annotation export/import** functionality (ready for backend integration)

### User Experience

- **Dark/light theme** support with smooth transitions
- **Loading states** with progress indicators and skeleton UI
- **Error handling** for corrupted or unsupported files
- **Print functionality** with page range selection
- **File upload** with drag-and-drop support

### Performance Optimizations

- **Lazy loading** of pages outside viewport
- **Memory management** for smooth performance
- **Worker thread utilization** for PDF parsing and rendering
- **Virtual scrolling** for large documents

### Integration Ready

- **TypeScript interfaces** for all PDF operations
- **Component architecture** designed for Supabase storage integration
- **Authentication hooks** preparation for user-specific annotations
- **Cloud storage** connection ready

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router 6** - Client-side routing
- **React-PDF** - PDF rendering and manipulation
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Framer Motion** - Animation library
- **Tanstack Query** - Data fetching and caching

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pdf-viewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Basic Usage

```tsx
import { PDFViewer } from "@/components/pdf/PDFViewer";

function App() {
  return (
    <PDFViewer
      file="path/to/document.pdf"
      enableAnnotations={true}
      enableSearch={true}
      enableThumbnails={true}
      onDocumentLoad={(document) => console.log("Loaded:", document)}
      onPageChange={(page) => console.log("Page:", page)}
    />
  );
}
```

### Advanced Configuration

```tsx
<PDFViewer
  file={pdfFile}
  initialPage={5}
  initialScale={1.5}
  enableAnnotations={true}
  enableSearch={true}
  enableThumbnails={true}
  enableOutline={true}
  enablePrint={true}
  enableDownload={true}
  onDocumentLoad={handleDocumentLoad}
  onPageChange={handlePageChange}
  onZoomChange={handleZoomChange}
  onAnnotationAdd={handleAnnotationAdd}
  onAnnotationUpdate={handleAnnotationUpdate}
  onAnnotationDelete={handleAnnotationDelete}
  onError={handleError}
/>
```

## ⌨️ Keyboard Shortcuts

| Shortcut                  | Action             |
| ------------------------- | ------------------ |
| `←` / `→`                 | Previous/Next page |
| `Page Up` / `Page Down`   | Previous/Next page |
| `Space` / `Shift + Space` | Next/Previous page |
| `Ctrl + +` / `Ctrl + -`   | Zoom in/out        |
| `Ctrl + 0`                | Fit to width       |
| `Ctrl + 1`                | Fit to page        |
| `Ctrl + F`                | Search             |
| `Ctrl + P`                | Print              |
| `Ctrl + T`                | Toggle thumbnails  |
| `Ctrl + R`                | Rotate clockwise   |

## 🏗️ Architecture

### Component Structure

```
src/
├── components/pdf/
│   ├── PDFViewer.tsx          # Main viewer component
│   ├── PDFToolbar.tsx         # Toolbar with controls
│   ├── PDFThumbnailSidebar.tsx # Thumbnail navigation
│   ├── PDFDocumentDisplay.tsx  # Document rendering
│   └── PDFFileUpload.tsx      # File upload interface
├── hooks/
│   ├── usePDFViewer.ts        # Main state management
│   └── useKeyboardShortcuts.ts # Keyboard navigation
├── types/
│   └── pdf.ts                 # TypeScript interfaces
└── lib/
    ├── pdfWorker.ts          # PDF.js worker setup
    └── samplePDFs.ts         # Sample documents
```

### State Management

The application uses a custom hook `usePDFViewer` that manages:

- Document state (pages, scale, rotation)
- Navigation (current page, search results)
- UI state (sidebar visibility, theme)
- Annotations and user interactions

### Type Safety

Comprehensive TypeScript interfaces ensure type safety:

- `PDFDocument` - Document metadata
- `PDFViewerState` - Application state
- `Annotation` - Annotation data structures
- `SearchResult` - Search functionality
- `PDFViewerProps` - Component props

## 🔧 Configuration

### Theme Customization

The application uses CSS variables for theming. Customize in `src/index.css`:

```css
:root {
  --primary: 221 83% 53%; /* Primary brand color */
  --pdf-viewer-bg: 240 6% 95%; /* Viewer background */
  --pdf-page-bg: 0 0% 100%; /* Page background */
  --pdf-annotation-highlight: 45 100% 50%; /* Highlight color */
}
```

### PDF.js Configuration

Worker configuration in `src/lib/pdfWorker.ts`:

```typescript
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🔮 Future Enhancements

- **Supabase Integration** - Cloud storage and user authentication
- **Real-time Collaboration** - Multi-user annotation sharing
- **Advanced OCR** - Text extraction from scanned documents
- **Digital Signatures** - Sign and verify PDF documents
- **Form Filling** - Interactive PDF form support
- **Mobile App** - React Native version
- **API Integration** - REST API for document management

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using modern web technologies for the next generation of document viewing experiences.
