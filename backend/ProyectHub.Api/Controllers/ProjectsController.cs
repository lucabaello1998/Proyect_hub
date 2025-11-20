using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProyectHub.Data;
using ProyectHub.Models;

namespace ProyectHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ProyectHubDbContext _context;

        public ProjectsController(ProyectHubDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            return await _context.Projects.ToListAsync();
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound();
            return project;
        }

        // POST: api/projects
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            if (project.Id > 0)
            {
                var userId = int.TryParse(User.FindFirst("userId")?.Value, out var uid) ? uid : 0;
                var userEmail = User.FindFirst("email")?.Value ?? "";
                var snapshot = System.Text.Json.JsonSerializer.Serialize(project);
                _context.AuditLogs.Add(new AuditLog
                {
                    UserId = userId,
                    Entity = "Project",
                    Action = "create",
                    EntityId = project.Id,
                    Timestamp = DateTime.UtcNow,
                    Data = snapshot,
                    PerformedByEmail = userEmail
                });
                await _context.SaveChangesAsync();
            }
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/projects/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
        {
            if (id != project.Id)
                return BadRequest();
            var existing = await _context.Projects.FindAsync(id);
            if (existing == null)
                return NotFound();
            // Guardar snapshot previo y actual
            var previous = System.Text.Json.JsonSerializer.Serialize(existing);
            // Solo actualiza los campos recibidos, manteniendo los demás
            existing.Title = project.Title ?? existing.Title;
            existing.Description = project.Description ?? existing.Description;
            existing.Author = project.Author ?? existing.Author;
            existing.Category = project.Category ?? existing.Category;
            existing.Stack = string.IsNullOrEmpty(project.Stack) ? existing.Stack : project.Stack;
            existing.Tags = string.IsNullOrEmpty(project.Tags) ? existing.Tags : project.Tags;
            existing.Images = string.IsNullOrEmpty(project.Images) ? existing.Images : project.Images;
            existing.ImageUrl = string.IsNullOrEmpty(project.ImageUrl) ? existing.ImageUrl : project.ImageUrl;
            existing.DemoUrl = string.IsNullOrEmpty(project.DemoUrl) ? existing.DemoUrl : project.DemoUrl;
            existing.RepoUrl = string.IsNullOrEmpty(project.RepoUrl) ? existing.RepoUrl : project.RepoUrl;
            existing.CreatedAt = string.IsNullOrEmpty(project.CreatedAt) ? existing.CreatedAt : project.CreatedAt;
            try
            {
                await _context.SaveChangesAsync();
                // Log de auditoría con cambios previos y actuales
                var userId = int.TryParse(User.FindFirst("userId")?.Value, out var uid) ? uid : 0;
                var userEmail = User.FindFirst("email")?.Value ?? "";
                var current = System.Text.Json.JsonSerializer.Serialize(existing);
                var auditData = System.Text.Json.JsonSerializer.Serialize(new { previous, current });
                _context.AuditLogs.Add(new AuditLog
                {
                    UserId = userId,
                    Entity = "Project",
                    Action = "update",
                    EntityId = existing.Id,
                    Timestamp = DateTime.UtcNow,
                    Data = auditData,
                    PerformedByEmail = userEmail
                });
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Projects.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/projects/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound();

            // Borrar imágenes físicas asociadas
            if (!string.IsNullOrEmpty(project.Images))
            {
                try
                {
                    var imageList = new List<string>();
                    if (project.Images.StartsWith("["))
                        imageList = System.Text.Json.JsonSerializer.Deserialize<List<string>>(project.Images) ?? new List<string>();
                    else
                        imageList.Add(project.Images);

                    foreach (var imageUrl in imageList)
                    {
                        // Solo borrar si es una URL local
                        if (imageUrl.Contains("/images/"))
                        {
                            var fileName = imageUrl.Split("/images/").Last();
                            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
                            if (System.IO.File.Exists(filePath))
                                System.IO.File.Delete(filePath);
                        }
                    }
                }
                catch { /* Ignorar errores de borrado */ }
            }

            // Guardar snapshot JSON del proyecto antes de eliminar
            var projectJson = System.Text.Json.JsonSerializer.Serialize(project);

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            // Log de auditoría avanzado
            var userId = int.TryParse(User.FindFirst("userId")?.Value, out var uid) ? uid : 0;
            var userEmail = User.FindFirst("email")?.Value ?? "";
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Entity = "Project",
                Action = "delete",
                EntityId = id,
                Timestamp = DateTime.UtcNow,
                Data = projectJson,
                PerformedByEmail = userEmail
            });
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
