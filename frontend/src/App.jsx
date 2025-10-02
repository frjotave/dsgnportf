import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Plus, Mail, Phone, MapPin, Github, Linkedin, Instagram, Eye, ExternalLink, Settings, Edit, Trash2, Loader2 } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:5001/api'

function App() {
  const [projects, setProjects] = useState([])
  const [siteConfig, setSiteConfig] = useState({
    designer_name: 'Alex Silva',
    designer_title: 'Designer Gráfico & Criativo Digital',
    designer_description: 'Especialista em branding, design digital e experiências visuais impactantes.',
    email: 'alex.silva@email.com',
    phone: '+55 (11) 99999-9999',
    location: 'São Paulo, SP'
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    year: new Date().getFullYear().toString(),
    client: ''
  })
  
  const [editingProject, setEditingProject] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const skills = [
    "Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Figma", 
    "Branding", "Web Design", "Print Design", "Typography", "UI/UX"
  ]

  // Função para buscar projetos da API
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        setError('Erro ao carregar projetos')
      }
    } catch (err) {
      setError('Erro de conexão com a API')
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar configurações do site
  const fetchSiteConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/config`)
      if (response.ok) {
        const data = await response.json()
        setSiteConfig(data)
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err)
    }
  }

  // Função para adicionar novo projeto
  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.image) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject)
      })

      if (response.ok) {
        const createdProject = await response.json()
        setProjects([createdProject, ...projects])
        setNewProject({
          title: '',
          description: '',
          image: '',
          category: '',
          year: new Date().getFullYear().toString(),
          client: ''
        })
        setIsAddDialogOpen(false)
        setSuccess('Projeto adicionado com sucesso!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao adicionar projeto')
      }
    } catch (err) {
      setError('Erro de conexão com a API')
    }
  }

  // Função para editar projeto
  const handleEditProject = async () => {
    if (!editingProject.title || !editingProject.description || !editingProject.image) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProject)
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
        setEditingProject(null)
        setIsEditDialogOpen(false)
        setSuccess('Projeto atualizado com sucesso!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao atualizar projeto')
      }
    } catch (err) {
      setError('Erro de conexão com a API')
    }
  }

  // Função para deletar projeto
  const handleDeleteProject = async (projectId) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
        setSuccess('Projeto deletado com sucesso!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao deletar projeto')
      }
    } catch (err) {
      setError('Erro de conexão com a API')
    }
  }

  // Carregar dados ao inicializar
  useEffect(() => {
    fetchProjects()
    fetchSiteConfig()
  }, [])

  // Limpar mensagens de erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando portfólio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mensagens de feedback */}
      {error && (
        <Alert className="fixed top-4 right-4 z-50 max-w-md bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="fixed top-4 right-4 z-50 max-w-md bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <h1 className="text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {siteConfig.designer_name}
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100">
                {siteConfig.designer_title}
              </p>
              <p className="text-lg max-w-2xl text-blue-50 leading-relaxed">
                {siteConfig.designer_description}
              </p>
              <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Contato
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Projetos
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-8xl">🎨</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Toggle */}
        <Button
          onClick={() => setIsAdmin(!isAdmin)}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          size="sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          {isAdmin ? 'Sair Admin' : 'Admin'}
        </Button>
      </header>

      {/* Skills Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Especialidades</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Projetos em Destaque</h2>
            {isAdmin && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo Projeto</DialogTitle>
                    <DialogDescription>
                      Adicione um novo projeto ao seu portfólio.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        placeholder="Nome do projeto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        placeholder="Ex: Branding, Web Design"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client">Cliente</Label>
                      <Input
                        id="client"
                        value={newProject.client}
                        onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Ano</Label>
                      <Input
                        id="year"
                        value={newProject.year}
                        onChange={(e) => setNewProject({...newProject, year: e.target.value})}
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">URL da Imagem</Label>
                      <Input
                        id="image"
                        value={newProject.image}
                        onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Descreva o projeto..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddProject} className="w-full">
                      Adicionar Projeto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white"
                          onClick={() => {
                            setEditingProject(project)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-500/90 hover:bg-red-600"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {project.year}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {project.client}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                  <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800">
                    Ver detalhes
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Projeto</DialogTitle>
              <DialogDescription>
                Edite as informações do projeto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                  placeholder="Nome do projeto"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Categoria</Label>
                <Input
                  id="edit-category"
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                  placeholder="Ex: Branding, Web Design"
                />
              </div>
              <div>
                <Label htmlFor="edit-client">Cliente</Label>
                <Input
                  id="edit-client"
                  value={editingProject.client}
                  onChange={(e) => setEditingProject({...editingProject, client: e.target.value})}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Ano</Label>
                <Input
                  id="edit-year"
                  value={editingProject.year}
                  onChange={(e) => setEditingProject({...editingProject, year: e.target.value})}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label htmlFor="edit-image">URL da Imagem</Label>
                <Input
                  id="edit-image"
                  value={editingProject.image}
                  onChange={(e) => setEditingProject({...editingProject, image: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  placeholder="Descreva o projeto..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditProject} className="flex-1">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Vamos Trabalhar Juntos?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Estou sempre aberto a novos projetos e colaborações. Entre em contato para discutirmos suas ideias.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>{siteConfig.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>{siteConfig.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{siteConfig.location}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 {siteConfig.designer_name} - Designer Gráfico. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
