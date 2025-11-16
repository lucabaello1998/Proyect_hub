import type { GitRepository, FileItem, FileContent, GitCommit } from '../types/project';

// Simulación de estructura de archivos para diferentes tipos de proyectos
const generateFileStructure = (projectType: 'react' | 'backend' | 'pwa'): FileItem[] => {
  const commonFiles: FileItem[] = [
    { name: 'README.md', type: 'file', path: 'README.md', size: 2431 },
    { name: '.gitignore', type: 'file', path: '.gitignore', size: 234 },
  ];

  switch (projectType) {
    case 'react':
      return [
        ...commonFiles,
        { name: 'package.json', type: 'file', path: 'package.json', size: 1234 },
        { name: 'vite.config.ts', type: 'file', path: 'vite.config.ts', size: 456 },
        {
          name: 'src',
          type: 'folder',
          path: 'src/',
          children: [
            { name: 'App.tsx', type: 'file', path: 'src/App.tsx', size: 2341 },
            { name: 'main.tsx', type: 'file', path: 'src/main.tsx', size: 432 },
            {
              name: 'components',
              type: 'folder',
              path: 'src/components/',
              children: [
                { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx', size: 1234 },
                { name: 'Footer.tsx', type: 'file', path: 'src/components/Footer.tsx', size: 567 },
              ]
            },
            {
              name: 'pages',
              type: 'folder',
              path: 'src/pages/',
              children: [
                { name: 'Home.tsx', type: 'file', path: 'src/pages/Home.tsx', size: 3456 },
                { name: 'About.tsx', type: 'file', path: 'src/pages/About.tsx', size: 1890 },
              ]
            }
          ]
        },
        {
          name: 'public',
          type: 'folder',
          path: 'public/',
          children: [
            { name: 'index.html', type: 'file', path: 'public/index.html', size: 678 },
            { name: 'favicon.ico', type: 'file', path: 'public/favicon.ico', size: 15086 },
          ]
        }
      ];

    case 'backend':
      return [
        ...commonFiles,
        { name: 'Program.cs', type: 'file', path: 'Program.cs', size: 1456 },
        { name: 'appsettings.json', type: 'file', path: 'appsettings.json', size: 234 },
        {
          name: 'Controllers',
          type: 'folder',
          path: 'Controllers/',
          children: [
            { name: 'ProjectController.cs', type: 'file', path: 'Controllers/ProjectController.cs', size: 4567 },
            { name: 'UserController.cs', type: 'file', path: 'Controllers/UserController.cs', size: 3456 },
          ]
        },
        {
          name: 'Models',
          type: 'folder',
          path: 'Models/',
          children: [
            { name: 'Project.cs', type: 'file', path: 'Models/Project.cs', size: 1234 },
            { name: 'User.cs', type: 'file', path: 'Models/User.cs', size: 987 },
          ]
        }
      ];

    case 'pwa':
      return [
        ...commonFiles,
        { name: 'manifest.json', type: 'file', path: 'manifest.json', size: 567 },
        { name: 'sw.js', type: 'file', path: 'sw.js', size: 2345 },
        { name: 'index.html', type: 'file', path: 'index.html', size: 1234 },
        {
          name: 'js',
          type: 'folder',
          path: 'js/',
          children: [
            { name: 'app.js', type: 'file', path: 'js/app.js', size: 5678 },
            { name: 'scanner.js', type: 'file', path: 'js/scanner.js', size: 3456 },
          ]
        }
      ];

    default:
      return commonFiles;
  }
};

// Simulación de contenido de archivos
const getFileContent = (path: string): FileContent => {
  const fileExtension = path.split('.').pop()?.toLowerCase() || '';
  
  const contentMap: Record<string, { content: string; language: string }> = {
    'src/App.tsx': {
      language: 'typescript',
      content: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;`
    },
    'src/components/Header.tsx': {
      language: 'typescript',
      content: `import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <Link to="/">Mi Proyecto</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Acerca de</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;`
    },
    'package.json': {
      language: 'json',
      content: `{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "typescript": "^4.9.4"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0"
  }
}`
    },
    'Controllers/ProjectController.cs': {
      language: 'csharp',
      content: `using Microsoft.AspNetCore.Mvc;
using MyProject.Models;
using MyProject.Services;

namespace MyProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null)
                return NotFound();
            
            return Ok(project);
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            var createdProject = await _projectService.CreateProjectAsync(project);
            return CreatedAtAction(nameof(GetProject), 
                new { id = createdProject.Id }, createdProject);
        }
    }
}`
    },
    'README.md': {
      language: 'markdown',
      content: `# Mi Proyecto

Este es un proyecto increíble que hace cosas geniales.

## 🚀 Características

- ✅ Interfaz moderna y responsiva
- ✅ Arquitectura escalable
- ✅ Código bien documentado
- ✅ Pruebas automatizadas

## 📦 Instalación

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🛠️ Tecnologías

- React 18
- TypeScript
- Vite
- Material-UI

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles.`
    }
  };

  const defaultContent = contentMap[path] || {
    language: getLanguageFromExtension(fileExtension),
    content: `// Contenido del archivo: ${path}
// Este es un archivo de ejemplo con contenido simulado

export default function ExampleFile() {
  console.log('Archivo: ${path}');
  return 'Contenido del archivo';
}`
  };

  return {
    path,
    content: defaultContent.content,
    language: defaultContent.language,
    size: defaultContent.content.length,
    lastModified: new Date().toISOString()
  };
};

const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'cs': 'csharp',
    'json': 'json',
    'md': 'markdown',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
  };
  
  return languageMap[extension] || 'text';
};

// Simulación de datos de Git
export const gitService = {
  getRepository: (projectId: number): GitRepository => {
    const projectTypes = ['react', 'backend', 'pwa'] as const;
    const projectType = projectTypes[projectId % 3];
    
    // Commits específicos según el proyecto
    const getProjectCommits = (id: number): GitCommit[] => {
      switch (id) {
        case 1: // Running App
          return [
            {
              hash: 'r1a2b3c',
              message: 'feat: agregar sistema de rankings por área',
              author: 'Diego Runner',
              date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              filesChanged: 4
            },
            {
              hash: 'r4d5e6f',
              message: 'fix: mejorar precisión GPS en rutas',
              author: 'Ana Sports',
              date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
              filesChanged: 2
            },
            {
              hash: 'r7g8h9i',
              message: 'feat: implementar desafíos semanales',
              author: 'Carlos Fitness',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              filesChanged: 6
            }
          ];
        case 2: // Court Finder
          return [
            {
              hash: 'c1j2k3l',
              message: 'feat: agregar filtro por tipo de cancha',
              author: 'María Courts',
              date: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
              filesChanged: 3
            },
            {
              hash: 'c4m5n6o',
              message: 'feat: integrar sistema de pagos Stripe',
              author: 'Pedro Reservas',
              date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
              filesChanged: 5
            },
            {
              hash: 'c7p8q9r',
              message: 'fix: optimizar búsqueda por geolocalización',
              author: 'Laura Maps',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
              filesChanged: 2
            }
          ];
        default: // ERP Interno y otros
          return [
            {
              hash: 'a1b2c3d',
              message: 'feat: agregar nueva funcionalidad de usuario',
              author: 'Juan Pérez',
              date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              filesChanged: 3
            },
            {
              hash: 'e4f5g6h',
              message: 'fix: corregir error en validación',
              author: 'María García',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
              filesChanged: 1
            },
            {
              hash: 'i7j8k9l',
              message: 'docs: actualizar documentación README',
              author: 'Carlos López',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
              filesChanged: 2
            }
          ];
      }
    };

    const commits = getProjectCommits(projectId);

    return {
      lastCommit: commits[0],
      structure: generateFileStructure(projectType),
      totalCommits: Math.floor(Math.random() * 50) + 20,
      contributors: Math.floor(Math.random() * 5) + 1
    };
  },

  getFileContent: (filePath: string): Promise<FileContent> => {
    // Simular latencia de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFileContent(filePath));
      }, Math.random() * 500 + 200);
    });
  },

  getCommitHistory: (projectId: number): GitCommit[] => {
    const getProjectMessages = (id: number) => {
      switch (id) {
        case 1: // Running App
          return [
            'feat: implementar tracking GPS en tiempo real',
            'feat: agregar sistema de puntuación por área',
            'fix: mejorar algoritmo de cálculo de distancia',
            'feat: agregar competencias entre usuarios',
            'fix: optimizar rendimiento en mapas',
            'feat: implementar notificaciones push'
          ];
        case 2: // Court Finder
          return [
            'feat: agregar búsqueda por tipo de deporte',
            'feat: implementar sistema de reservas online',
            'fix: corregir integración con Google Maps',
            'feat: agregar filtros por precio y horario',
            'feat: implementar calificaciones de canchas',
            'fix: mejorar UX en proceso de pago'
          ];
        default:
          return [
            'feat: nueva funcionalidad',
            'fix: corrección de bugs',
            'docs: actualizar documentación',
            'refactor: mejorar código',
            'test: agregar pruebas',
            'style: mejorar estilos'
          ];
      }
    };

    const authors = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Diego Runner', 'Pedro Reservas'];
    const messages = getProjectMessages(projectId);

    return Array.from({ length: 10 }, (_, i) => ({
      hash: Math.random().toString(36).substr(2, 7),
      message: messages[Math.floor(Math.random() * messages.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString(),
      filesChanged: Math.floor(Math.random() * 5) + 1
    }));
  }
};